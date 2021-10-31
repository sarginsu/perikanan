import React, { useState, useEffect, createContext } from 'react';
import { Row, Col, Button, Modal, Spin, notification } from 'antd';
import './index.scss';
import uuidHelper from '../../helpers/UuidHelper';
import {
  addRow,
  getList,
  getSize,
  getArea,
  searchList
} from '../../api/Api';
import JsonToForm from 'json-reactform';
import FormInput from '../../components/form/FormInput';
import FormFilter from '../../components/form/FormFilter';
import EditableTable from '../../components/table/EditableTable';
import PieChart from '../../components/charts/PieChart';
import LineChart from '../../components/charts/LineChart';

export const MyContext = createContext();

const Dashboard = () => {
  const [listData, setListData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingForm, setIsLoadingForm] = useState();
  const [showModal, setShowModal] = useState(false);
  const [formInput, setFormInput] = useState(FormInput);
  const [formFilter, setFormFilter] = useState(FormFilter);
  const [listProvince, setListProvince] = useState();
  const [fullArea, setFullArea] = useState();

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        let listData = await getList();
        setListData(listData);
        const listSize = await getSize();
        const listArea = await getArea();
        const arrSize = listSize.map(val => {
          return { value: val.size, label: val.size }
        })

        let arrKota = [];
        let arrProvinsi = [];
        let tempProvinsi = [];
        listArea.forEach(val => {
          const kota = { value: val.city, label: val.city };
          arrKota = [...arrKota, kota];

          const provinsi = { value: val.province, label: val.province };
          const index = tempProvinsi.indexOf(val.province);
          if (index === -1) {
            arrProvinsi = [...arrProvinsi, provinsi];
            tempProvinsi = [...tempProvinsi, val.province];
          }
        });

        const { area_kota, size } = FormInput;
        area_kota.options = arrKota;
        size.options = arrSize;
        setFormInput(FormInput);

        const { Kota, Provinsi, Ukuran } = FormFilter;
        Kota.options = arrKota;
        Provinsi.options = arrProvinsi;
        Ukuran.options = arrSize;
        setFormFilter(FormFilter);
        setListProvince(tempProvinsi);
        setFullArea(listArea);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  const handleSubmit = async (data) => {
    setShowModal(false);
    setIsLoading(true);
    const { area_kota, size } = data;
    const [area] = fullArea.filter(item => item.city === area_kota.value);
    const newData = {
      uuid: uuidHelper(),
      komoditas: data.komoditas.toUpperCase(),
      price: data.price,
      area_kota: area_kota.value,
      area_provinsi: area.province,
      size: size.value,
      tgl_parsed: new Date().toISOString(),
      timestamp: new Date().getTime().toString()
    }

    try {
      await addRow([newData]);
      let listHarga = await getList();
      setListData(listHarga);
      notification['success']({
        message: 'Input data sukses!',
        description: `${data.komoditas} berhasil di simpan.`,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (data) => {
    try {
      const filter = {
        komoditas: data.Komoditas.toUpperCase() || undefined,
        price: data.Harga || undefined,
        area_provinsi: data.Provinsi.value || undefined,
        area_kota: data.Kota.value || undefined,
        size: data.Ukuran.value || undefined,
      }
      let listData = await searchList(filter);
      setListData(listData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      setFormFilter(FormFilter)
      const listData = await getList();
      setListData(listData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModal = async () => {
    setIsLoadingForm(true);
    await setFormInput(FormInput);
    setShowModal(true);
    setIsLoadingForm(false);
  };

  return (
    <MyContext.Provider value={listData}>
      <Row className="content">
        <Col xs={24} md={24} xl={12}>
          <div className="widget">
            <span className="top-title">
              Data Berdasarkan Provinsi
            </span>
            {
              !isLoading ? (
                <PieChart container="chart1" province={listProvince} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Spin />
                </div>
              )
            }
          </div>
        </Col>
        <Col xs={24} md={24} xl={12}>
          <div className="widget">
            <span className="top-title">
              Harga Komoditas
            </span>
            {
              !isLoading ? (
                <LineChart container="chart2" province={listProvince} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Spin />
                </div>
              )
            }
          </div>
        </Col>
        <Col xs={24} md={24} xl={6}>
          <div className="widget">
            <div className="top-title">
              Pencarian
            </div>
            {
              !isLoading ? (
                <>
                  <JsonToForm model={formFilter} onSubmit={handleSearch} />
                  <Button onClick={handleReset} size="small">
                    Reset
                  </Button>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Spin />
                </div>
              )
            }
          </div>
        </Col>
        <Col xs={24} md={24} xl={18}>
          <div className="widget-no-border">
            <span className="top-title">
              Harga Komiditas Ikan
            </span>
            <Button
              loading={isLoading}
              onClick={handleModal}
              style={{ background: '#28a745', borderRadius: 4, borderColor: '#28a745', marginBottom: 20 }}
              type="primary">
              Tambah Data {showModal}
            </Button>
            <Modal
              title="Form Input Harga Komoditas"
              centered
              visible={showModal}
              footer={null}
              onCancel={() => setShowModal(false)}
            >
              {
                !isLoadingForm && (
                  <JsonToForm model={formInput} onSubmit={handleSubmit} />
                )
              }
            </Modal>
            <EditableTable isLoading={isLoading} reset={handleReset} />
          </div>
        </Col>
      </Row>
    </MyContext.Provider>
  )
};

export default Dashboard;