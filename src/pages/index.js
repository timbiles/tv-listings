import React, { Component } from 'react'
import { Link } from 'gatsby'
import axios from 'axios';
import moment from 'moment';

import Layout from '../components/layout'
import './styles/index.css';

class Index extends Component {

  state = {
    show: '',
    info: [],
    sum: false
  }

  componentDidMount(){
  }

  getListings(){
    axios.get(`http://api.tvmaze.com/search/shows?q=${this.state.show}`).then(res=> {
      this.setState({info: res.data[0].show})
    })
  }

  getShow(){
    axios.get('http://api.tvmaze.com/shows/17128?embed=nextepisode').then(res=> {
      console.log('Show info>>>', res.data)
    })
  }

  nextEpisode(){
    axios.get('http://api.tvmaze.com/shows/1/episodebynumber?season=3&number=4').then(res=> {
      console.log('next episode', res.data)
    })
  }

  searchShow = () => {
    this.getListings()
    this.getShow()
  }

  render(){
    console.log(this.state.info)
const {info, sum} = this.state

    return (

      <Layout>
        <div className='home'>

        <h1>TV Search</h1>
        <h4>Search a show!</h4>
        <input type="text" onChange={e=>this.setState({show: e.target.value})}/>
        <button onClick={() => this.searchShow()}>Search!</button>
            {
              info.length !==0 &&
              <div className='show'>

            <div className='show_info'>

            <h4>{info.name}</h4>
            <img src={info.image.medium} alt={info.name}/>            
            <p>{info.network.name}</p>
            {info.status === 'Ended' ?
          <p>This show has ended.</p>
          : info.length !==0 &&  
          <p>{info.name} is on air {info.schedule.days[0]}'s at {moment.utc(info.schedule.time, ["h:mm A"]).format("LT")}</p>}
          <p className='click' onClick={()=> this.setState({sum: !sum})}>Summary</p>
          {
            sum &&
          <p>{info.summary.replace(/<p>|<\/p>|<b>|<\/b>|<i>|<\/i>/gi, '')}</p>
          }
          
          </div>
          <div className='show_info'>
          <p>This is episode information</p>
          <div className='show_btns'>
            <p className='click'>Previous</p>
            <p className='click' onClick={() => this.nextEpisode()}>Next</p>
          </div>
          </div>
          </div>
          
          }
            

        </div>
    
  </Layout>
    )
  }
}
  


export default Index;
