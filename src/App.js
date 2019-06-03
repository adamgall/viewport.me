import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: null,
      xChainUrl: null,
      desc: null,
    }
  }

  componentDidMount() {
    const assetId = window.location.pathname;
    let self = this;
    return axios.get('https://xchain.io/api/asset' + assetId).then(function (response) {
      const data = response.data.description.split(';');
      self.setState({
        imgUrl: data[0].replace('imgur', 'https://i.imgur.com'),
        xChainUrl: 'https://xchain.io/asset' + assetId,
        desc: data[1]
      });
    });
  }

  render() {
    return (
      <div className="App App-header">
        <h1>Viewport.me</h1>
        <div id="SearchField">Freeport Asset ID: <input type="text" id="text" /> <a href="javascript:window.location.href=document.getElementById('text').value;">GO</a></div>
        {this.state.imgUrl &&
          <div>
            <img src={this.state.imgUrl} alt="meme" />
            <p>{this.state.desc}</p>
            <p class="xchainDetails">Asset Details: <a href={this.state.xChainUrl}>{this.state.xChainUrl}</a></p>
            <p class="smallNotice">Create your own Cryptogoods at <a href="http://freeport.io" target="_blank">Freeport.io</a>!</p>
          </div>
        }
      </div>
    );
  }
}

export default App;
