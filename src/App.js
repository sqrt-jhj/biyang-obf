import React, { Component } from 'react';
import './App.css';
import Axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      host : '',
    }
  }

  componentDidMount() {
    this._getHost();
  }

  _getHost = async() => {
    const res = await Axios.get('/api/host');
    this.setState({ host : res.data.host})
  }

  render() {
    return (
      <div className='App'>
        <h3> Welcome to OBF <u>{this.state.host}</u></h3>
      </div>
    )
  }
}

export default App;
