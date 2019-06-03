import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

const imgurUrl = 'https://i.imgur.com';
const xChainAssetBase = 'https://xchain.io/asset/';
const xChainApiAssetBase = 'https://xchain.io/api/asset/';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetId: null,
      imgUrl: null,
      xChainUrl: null,
      desc: null,
      err: false
    }
  }

  componentDidMount() {
    // get the path from URL. should be a counterparty Asset ID
    const assetId = window.location.pathname.substring(1);
    
    // if we're at the root URL, then return, there's nothing else to do
    if (!assetId) return;

    // set the `assetId` state property to the assetId in the URL,
    // we'll be using it if there's an error fetching data
    this.setState({ assetId });

    // grab a reference to `this`, call it `self`, we'll use it for
    // updating state within the axios response context
    let self = this;

    // call the xchain.io api with freeport assetId
    return axios.get(xChainApiAssetBase + assetId).then(function (response) {

      // if properly formed Freeport assetId, then the description should contain
      // the imgur reference, then a semicolon, then the title of the asset,
      const data = response.data.description.split(';');

      // make sure there are two pieces of data that were split with `;`,
      // also make sure the first piece of data includes the string 'imgur'.
      if (data.length !== 2 || !data[0].includes('imgur')) {
        
        // if not, it's an error
        self.setState({ err: true });
        return;
      }
      
      // if we got this far, we've likely got a valid Freeport assetId,
      // so set some more parts of the state
      self.setState({
        
        // replace the 'imgur' refernce with the actual imgur url
        imgUrl: data[0].replace('imgur', imgurUrl),

        // create the counterparty URL
        xChainUrl: xChainAssetBase + assetId,

        // get the Freeport description
        desc: data[1]
      });

    // if there was a problem calling the counterparty API, it'll get caught here
    }).catch(function () {
      
      // set the error state
      self.setState({ err: true });
    });
  }

  render() {
    return (
      <div className="container-fluid d-flex flex-column bg-dark text-white text-center">
        <main className="flex-fill">
          { title() }
          { assetForm() }
          { error(this.state) }
          { assetData(this.state) }
        </main>
        <footer>
          { footer() }
        </footer>
      </div>
    );
  }
}

function title() {
  return (
    <div className="row pb-5 pt-4">
      <div className="col">
        <h1 className="display-2"><a className="text-light" href="/">Viewport.me</a></h1>
      </div>
    </div>
  );
}

function assetForm() {
  let newAssetID = null;

  function captureNewAssetID(event) {
    newAssetID = event.target.value;
  }

  function loadNewAsset(event) {
    event.preventDefault();
    if (!newAssetID) return;
    window.location.assign(newAssetID);
  }

  return (
    <div className="row pb-4">
      <div className="col">
        <form onSubmit={loadNewAsset}>
          <div className="form-row">
            <div className="col-2 col-md-3 col-lg-4" />
            <div className="col-6 col-md-5 col-lg-3">
              <input type="text" className="form-control" placeholder="Freeport Asset ID" onChange={captureNewAssetID} />
            </div>
            <div className="col-2 col-md-1">
              <button type="submit" className="btn btn-block btn-light">GO</button>
            </div>
            <div className="col-2 col-md-3 col-lg-4" />
          </div>
        </form>
      </div>hello
    </div>what
  );
}

function error(state) {
  if (!state.err) return;

  return (
    <div className="row">
      <div className="col p-3 mb-2 bg-warning text-dark">
        Freeport Asset ID <span className="font-weight-bold">{state.assetId}</span> invalid or malformed  
      </div>
    </div>
  );
}

function assetData(state) {
  if (!state.imgUrl) return;
  
  return (
    <div>
      <div className="row pb-3">
        <div className="col">
          <img className="img-fluid shadow" src={state.imgUrl} alt="meme" />
        </div>
      </div>
      <div className="row pb-5">
        <div className="col">
          <h1 className="display-4 font-italic">{state.desc}</h1>
        </div>
      </div>
      <div className="row pb-3">
        <div className="col">
          <span>Asset Details: </span>
          <a className="text-light" href={state.xChainUrl}>{state.xChainUrl}</a>
        </div>
      </div>
    </div>
  );
}

function footer() {
  return (
    <div className="row pb-3">
      <div className="col small">
        <span>Create your own Cryptogoods at </span>
        <a className="text-light" href="https://freeport.io" target="_blank" rel="noopener noreferrer">Freeport.io</a>
        <span>!</span>
      </div>
    </div>
  );
}

export default App;
