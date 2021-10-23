import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar.js';
import Dashboard from './pages/Dashboard'
import { Layout } from 'antd';
import './App.scss';

const { Content } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Navbar />

        <Content>
          <Switch>
            <Route path='/' exact component={Dashboard}></Route>
          </Switch>
        </Content>

      </Layout>
    </BrowserRouter>
  );
}

export default App;
