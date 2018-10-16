import React, { Component } from 'react'
// import { Link } from 'gatsby'
import axios from 'axios';
import moment from 'moment';

import Layout from '../components/layout'
import './styles/index.css';

class Index extends Component {

  state = {
    show: '',
    index: '',
    showID: '',
    info: [],
    next: [],
    prev: [],
    episodes: [],
    episode: true,
    sum: false,
    initial: false
  }

  searchShow = async () => {
    await this.getListings()
    await this.showAll()
  }

 async getListings(){
    await axios.get(`http://api.tvmaze.com/search/shows?q=${this.state.show}`).then(res=> {
      this.setState({info: res.data[0].show, showID: res.data[0].show.id}) 
    })
    await axios.get(`http://api.tvmaze.com/shows/${this.state.showID}?embed=nextepisode`).then(res=> {
      this.setState({embed: res.data._embedded.nextepisode})
    })
  }

  async showAll() {
    const {showID} = this.state
    
    await axios.get(`http://api.tvmaze.com/shows/${showID}/episodes`).then(res=> {
      this.setState({episodes: res.data})
    })
    await this.findEpisodes()
    
  }

  findEpisodes(){
    const {showID, episodes} = this.state
    const {season, number} = this.state.embed
     axios.get(`http://api.tvmaze.com/shows/${showID}/episodebynumber?season=${season}&number=${number}`).then(res=> {
      let find = episodes.findIndex(e => e.id === res.data.id)
      this.setState({ index: find})
    })
  }

  nextEpisode = () => {
    const { index, initial} = this.state

   !initial 
    ? this.setState({index: index, initial: true, episode: false})
    : this.setState({index: index+1})
  }

  prevEpisode = () => {
    const { index } = this.state

    this.setState({index: index-1, episode: false})
  
  }

  render(){
    const {info, sum, episode, episodes, index} = this.state

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
              <h4>{episodes[index].name}</h4>
              <p>{moment.utc(episodes[index].airdate).format('MMM Do, YYYY')}</p>
              <p>{moment.utc(episodes[index].airtime, ["h:mm A"]).format("LT")}</p>
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
