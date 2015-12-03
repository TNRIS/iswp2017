
import React from 'react';
import Select from 'react-select';

export default React.createClass({
  getInitialState() {
    return {};
  },
  
  changeNavCategory(e) {
    console.log(e.target.value);
  },

  // logChange(val) {
  //   console.log("Selected: " + val);
  // },

  render() {
    // var options = [
    //   { value: 'one', label: 'One' },
    //   { value: 'two', label: 'Two' }
    // ];
    //<Select className="nav-category-select" options={options} onChange={this.logChange} />

    return (
      <div className="header-nav">
        <div className="wrapper">
          <label htmlFor="nav-category-select">View data for</label>
          <select onChange={this.changeNavCategory} className="nav-category-select" id="nav-category-select">
            <option value="statewide">Statewide</option>
            <option value="region">Region</option>
            <option value="county">County</option>
            <option value="entity">Water User Group</option>
          </select>

        </div>
      </div>
    );
  }
});