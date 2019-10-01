import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {
  state = {
    fishes: {},
    order: {},
  };

  static propTypes = {
    match: PropTypes.object,
  };

  componentDidMount() {
    const { params } = this.props.match;
    const localStorageRef = localStorage.getItem(params.storeID);
    if (localStorageRef) {
      this.setState({ order: JSON.parse(localStorageRef) });
    }
    this.ref = base.syncState(`${params.storeID}/fishes`, {
      context: this,
      state: 'fishes',
    });
  }

  componentDidUpdate() {
    const value = JSON.stringify(this.state.order);
    localStorage.setItem(this.props.match.params.storeID, value);
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  addFish = fish => {
    const fishes = { ...this.state.fishes };
    fishes[`fish${Date.now()}`] = fish;
    this.setState(() => ({ fishes }));
  };

  updateFish = (id, updatedFish) => {
    this.setState(prevState => ({
      ...prevState,
      fishes: {
        ...prevState.fishes,
        [id]: updatedFish,
      },
    }));
  };

  deleteFish = fishID => {
    const fishes = { ...this.state.fishes };
    // commented out the solution because it doesn't work well with firebase
    // to be deleted in firebase we need to set the fish to 'null'
    // const updatedFishes = {};
    // Object.keys(fishes)
    //   .filter(key => key !== fishID)
    //   .forEach(fish => (updatedFishes[fish] = fishes[fish]));
    // this.setState(() => ({
    //   fishes: updatedFishes,
    // }));
    fishes[fishID] = null;
    this.setState({ fishes });
  };

  loadSampleFishes = () => {
    this.setState({ fishes: sampleFishes });
  };

  addToOrder = key => {
    const order = { ...this.state.order };
    order[key] = order[key] + 1 || 1;
    this.setState(() => ({ order }));
  };

  removeFromOrder = fishId => {
    const order = {
      ...this.state.order,
      // [fishId]: this.state.order[fishId] - 1,
    };

    // if (order[fishId] < 1) {
    //   order[fishId] = null;
    delete order[fishId];
    // }

    this.setState(prevState => ({
      ...prevState,
      order,
    }));
  };

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh seafood market" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key => (
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />
            ))}
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          addFish={this.addFish}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
        />
      </div>
    );
  }
}

export default App;
