import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import moment from 'moment';
import './Navbar.scss';

const Navbar = () => {
  const now = moment().format('DD MMMM YYYY');

  return (
    <div className="top-menu">
      <div className="top-bar">
        <Row>
          <Col xs={24} md={6} xl={6}>
            <Link to="/">
              <img alt="Efishery" src="/logo-efishery.png" width="135" />
            </Link>
          </Col>
        </Row>
      </div>
      <div className="sub-menu">
        <span className="text-date">
          {now}
        </span>
      </div>
    </div>
  )
};

export default Navbar;