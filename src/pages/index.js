import React, { Component } from 'react'
import { Link } from 'gatsby'
import axios from 'axios';

import Layout from '../components/layout'
import './styles/index.css';

class Index extends Component {

  state = {
    show: '',
    info: []
  }

  componentDidMount(){
  }

  getListings(){
    axios.get(`http://api.tvmaze.com/search/shows?q=${this.state.show}`).then(res=> {
      console.log(res.data[0].show)
      this.setState({info: res.data[0].show})
    })
  }

  searchShow = () => {
    this.getListings()

  }

  render(){
    console.log(this.state.info)
const {info} = this.state
// const map = info.length && info.show.map(e=> {
//   return <div key={e.id}>
//       <h4>{e.name}</h4>
//   </div>
// })

    return (

      <Layout>
        <div className='home'>

        <h1>TV Search</h1>
        <h4>Search a show!</h4>
        <input type="text" onChange={e=>this.setState({show: e.target.value})}/>
        <button onClick={() => this.searchShow()}>Search!</button>
          <div>
            <h4>{info.name}</h4>
            <p>{info.type}</p>
          </div>

    <Link to="/page-2/">Go to page 2</Link>
        </div>
    
  </Layout>
    )
  }
}
  


export default Index;
