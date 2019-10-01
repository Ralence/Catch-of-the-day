import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import base, { firebaseApp } from '../base';
import 'firebase/auth';

import AddFishForm from './AddFishForm';
import EditFishForm from './EditFishForm';
import Login from './Login';

class Inventory extends React.Component {
  static propTypes = {
    addFish: PropTypes.func,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    loadSampleFishes: PropTypes.func,
    fishes: PropTypes.object,
  };

  state = {
    uid: null,
    owner: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authHandler({ user });
      }
    });
  }

  authHandler = async authData => {
    // 1 look up the current store in the DB
    const store = await base.fetch(this.props.storeID, { context: this });
    // 2 claim it if there is no owner
    if (!store.owner) {
      await base.post(`${this.props.storeID}/owner`, {
        data: authData.user.uid,
      });
    }
    // 3 set the state of inventory component to reflect the current user
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid,
    });
  };

  authenticate = provider => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  };

  logoutHandler = async () => {
    await firebase.auth().signOut();
    this.setState({ uid: null });
  };

  render() {
    const logoutBtn = (
      <button type="button" onClick={this.logoutHandler}>
        Logout
      </button>
    );
    // Check if the user is logged in
    if (!this.state.uid) {
      return <Login authenticate={this.authenticate} />;
    }
    // Check if the user is NOT the store owner
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you are not the owner!</p>
          {logoutBtn}
        </div>
      );
    }
    // The user is the store owner so render the inventory
    return (
      <div className="inventory">
        <h2>Inventory</h2>
        {logoutBtn}
        {Object.keys(this.props.fishes).map(key => (
          <EditFishForm
            key={key}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
            fishID={key}
            fish={this.props.fishes[key]}
          />
        ))}
        <AddFishForm addFish={this.props.addFish} />
        <button type="button" onClick={this.props.loadSampleFishes}>
          Load Sample Fishes
        </button>
      </div>
    );
  }
}

export default Inventory;
