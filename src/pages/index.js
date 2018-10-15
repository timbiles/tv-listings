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
    sum: false,
    episode: true,
    content: [],
    embed: [],
    showID: '',
    episodes: []
  }

  searchShow = () => {
    this.getListings()
    this.showAll()
  }

  async getListings(){
    await axios.get(`http://api.tvmaze.com/search/shows?q=${this.state.show}`).then(res=> {
      this.setState({info: res.data[0].show,showID: res.data[0].show.id}) 
    })
    await this.getShow();
  }

  getShow(){
    const{showID} = this.state
    axios.get(`http://api.tvmaze.com/shows/${showID}?embed=nextepisode`).then(res=> {
      this.setState({embed: res.data._embedded.nextepisode})
    })
  }

  nextEpisode(){
    const { showID} = this.state
    const {season, number} = this.state.embed
    axios.get(`http://api.tvmaze.com/shows/${showID}/episodebynumber?season=${season}&number=${number}`).then(res=> {
      console.log('next episode', res.data)
      this.setState({content: res.data, episode: false})
    })
  }

  prevEpisode(){
    const {showID, episodes} = this.state

    


  }

  showAll() {

    axios.get('http://api.tvmaze.com/shows/17128/episodes').then(res=> {
      let map = res.data.filter(e=> {
        const d1 = new Date()
        const d2 = new Date(e.airdate)
        return d1.getTime() >= d2.getTime()
      })
      this.setState({episodes: map})
    })
  }

  render(){
    console.log(this.state)
    console.log(Date())
    const {info, sum, episode, content} = this.state

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
          {episode ?
          <div>

            <div className='show_info'>
            
            <p>This is episode information</p>
            </div>
            <div className='show_btns'>
              <p className='click' onClick={() => this.prevEpisode()}>Previous</p>
              <p className='click' onClick={() => this.nextEpisode()}>Next</p>
            </div>
            
            </div>
          :
          <div>

          <div className='show_info'>
              <h4>{content.name}</h4>
              <p>{moment.utc(content.airdate).format('MMM Do, YYYY')}</p>
              <p>{moment.utc(content.airtime, ["h:mm A"]).format("LT")}</p>
          </div>
          <div className='show_btns'>
            <p className='click' onClick={()=> this.prevEpisode()}>Previous</p>
            <p className='click' onClick={() => this.nextEpisode()}>Next</p>            
          </div>
          </div>
        }
          
          </div>
          
          }
            

        </div>
    
  </Layout>
    )
  }
}
  


export default Index;
