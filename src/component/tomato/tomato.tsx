import React from 'react'
import Tomatoinput from './tomatoinput'
import Tomatolist from './tomatolist'
import axios from '../../config/axios'
import { addTomato, updateTomato } from '../../redux/reducers/actions'
import { connect } from 'react-redux'
import _ from 'lodash'
import { format } from 'date-fns'
import './tomato.scss'

interface ITomatoProps {
  addTomato: (payload: any) => void,
  updateTomato: (patload: any) => void,
  tomatoes: any[]
}

class Tomato extends React.Component<ITomatoProps> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  addTomato = async (params: any) => {
    await axios.post('/tomatoes', params)
      .then(res => { this.props.addTomato(res.data.resource) })
      .catch(err => { throw new Error(err) })
  }

  get unfinishedTomato() {
    return this.props.tomatoes.filter((t: any) => !t.description && !t.ended_at && !t.aborted)[0]
  }

  get finishedTomatoes() {
    const finishedtomatoes = this.props.tomatoes.filter((t: any) => t.description && t.ended_at && !t.aborted)
    const obj = _.groupBy(finishedtomatoes, tomato => format(Date.parse(tomato.started_at), 'yyyy/MM/dd'))
    return obj
  }

  upDateTomato = (payload: any) => {
    this.props.updateTomato(payload)
  }

  render() {
    return (
      <div id="tomato">
        <Tomatoinput addTomato={this.addTomato} unfishedTomato={this.unfinishedTomato} updateTomato={this.upDateTomato} />
        <Tomatolist finishedTomatoes={this.finishedTomatoes} />
      </div>
    )
  }
}

const mapDispatchToProps = {
  addTomato,
  updateTomato
}

const mapStateToProps = (state: any, ownProps: any) => ({
  tomatoes: state.tomatoes,
  ...ownProps
})

export default connect(mapStateToProps, mapDispatchToProps)(Tomato)

