import React, { Component } from 'react';
import PropTypes from 'prop-types';

class EditFishForm extends Component {
  static propTypes = {
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    fishID: PropTypes.string,
    fish: PropTypes.shape({
      name: PropTypes.string,
      image: PropTypes.string,
      desc: PropTypes.string,
      status: PropTypes.string,
      price: PropTypes.number,
    }),
  };

  handleChange = event => {
    const key = event.target.name;
    const val = event.target.value;
    const updatedFish = {
      ...this.props.fish,
      [key]: val,
    };
    this.props.updateFish(this.props.fishID, updatedFish);
  };

  render() {
    return (
      <div className="fish-edit">
        <input
          type="text"
          name="name"
          value={this.props.fish.name}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="price"
          value={this.props.fish.price}
          onChange={this.handleChange}
        />
        <select
          type="text"
          name="status"
          value={this.props.fish.status}
          onChange={this.handleChange}
        >
          <option value="available">Fresh</option>
          <option value="unavailable">Sold Out</option>
        </select>
        <textarea
          name="desc"
          value={this.props.fish.desc}
          onChange={this.handleChange}
        />
        <input
          type="text"
          name="image"
          value={this.props.fish.image}
          onChange={this.handleChange}
        />
        <button
          type="button"
          onClick={() => this.props.deleteFish(this.props.fishID)}
        >
          Remove Fish
        </button>
      </div>
    );
  }
}

export default EditFishForm;
