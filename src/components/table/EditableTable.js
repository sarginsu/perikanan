import React, { useState, useContext } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button, notification } from 'antd';
import { SortString, SortStringDate, SortNumber } from '../../helpers/SortHelper';
import { editRow, deleteRow } from '../../api/Api';
import moment from 'moment';
import { MyContext } from "../../pages/Dashboard/index.js";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Silahkan Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({
  isLoading,
  reset
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [tableLoading, setTableLoading] = useState(false);
  const data = useContext(MyContext);

  const isEditing = (record) => record.uuid === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.uuid);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const handleDelete = async (id) => {
    setTableLoading(true);
    try {
      await deleteRow(id);
      notification['success']({
        message: 'Hapus data sukses!',
        description: `Uuid ${id} berhasil di hapus.`,
      });
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setTableLoading(false);
    }
  };

  const handleSaveEdit = async (record) => {
    setTableLoading(true);
    try {
      let row = await form.validateFields();
      row.komoditas = row.komoditas.toUpperCase();
      let newData = { ...record, ...row };

      await editRow(newData.uuid, newData);
      notification['success']({
        message: 'Edit data sukses!',
        description: `${newData.komoditas} berhasil di edit.`,
      });
      reset();
    } catch (errInfo) {
      console.log(errInfo);
    } finally {
      setEditingKey('');
      setTableLoading(false);
    }
  };

  const columns = [
    {
      title: 'Komoditas',
      dataIndex: 'komoditas',
      key: 'komoditas',
      sorter: (a, b) => SortString(a.komoditas, b.komoditas),
      editable: true,
    },
    {
      title: 'Harga',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      sorter: (a, b) => SortNumber(a.price, b.price),
      render: (price) => parseInt(price).toLocaleString(),
      editable: true,
    },
    {
      title: 'Ukuran',
      dataIndex: 'size',
      key: 'size',
      align: 'right',
      sorter: (a, b) => SortNumber(a.size, b.size),
      render: (size) => parseInt(size).toLocaleString(),
      responsive: ['md']
    },
    {
      title: 'Kota',
      dataIndex: 'area_kota',
      key: 'area_kota',
      sorter: (a, b) => SortString(a.area_kota, b.area_kota),
      responsive: ['md']
    },
    {
      title: 'Provinsi',
      dataIndex: 'area_provinsi',
      key: 'area_provinsi',
      sorter: (a, b) => SortString(a.area_provinsi, b.area_provinsi),
      responsive: ['lg']
    },
    {
      title: 'Tanggal',
      dataIndex: 'tgl_parsed',
      key: 'tgl_parsed',
      sorter: (a, b) => SortStringDate(a.tgl_parsed, b.tgl_parsed),
      render: tgl_parsed => (
        moment(tgl_parsed).format('DD MMM YYYY - HH:mm')
      ),
      responsive: ['lg']
    },
    {
      title: 'Aksi',
      dataIndex: 'aksi',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => handleSaveEdit(record)}
              size="small"
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button
                size="small"
              >Cancel</Button>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{
                marginRight: 8,
              }}
            >
              Edit
            </Typography.Link>
            <Button
              type="text"
              size="small"
              onClick={() => handleDelete(record.uuid)}
              danger
            >
              Hapus
            </Button>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'price' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        loading={isLoading || tableLoading}
      />
    </Form>
  );
};

export default EditableTable;