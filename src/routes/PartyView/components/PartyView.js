import React from 'react'
import TurnatoBar from '../../../TurnatoBar/TurnatoBar'
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Link } from 'react-router'
import Subheader from 'material-ui/Subheader';
import ActionGroupWork from 'material-ui/svg-icons/action/group-work';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ImageRemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PlacesCasino from 'material-ui/svg-icons/places/casino';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import CopyToClipboard from 'react-copy-to-clipboard';
import { browserHistory } from 'react-router'


class PartyView extends React.Component {
  componentWillMount() {
    this.setState({link: window.location.href,
                   linkCopied: false})
  }
  componentDidMount() {
    this.props.joinParty(this.props.token, this.props.params.id)
  }
  componentWillUnmount() {
    this.props.leaveParty(this.props.token, this.props.params.id)
  }
  down(game) {
    return () => {
      if (game.loading)
        return
      this.props.down(this.props.info.code, game.code)
    }
  }
  render() {
    let joinMatch = (match) => () => {
      browserHistory.push('/g/' + match.game_code + '/' + match._id);
    };

    if (this.props.info.loading) {
      return (
        <TurnatoBar disconnected={this.props.disconnected}>
          <Card>
            <CardText style={{textAlign: "center"}}>
              <CircularProgress size={80} thickness={5} />
            </CardText>
          </Card>
        </TurnatoBar>);
    }
    // PARTY
    let partyName = this.props.info.name;
    let currentUser = this.props.info.currentUser;
    let currentUserId = this.props.info.users[currentUser];
    let partyMemberCount = this.props.info.users.length;
    let usersNickname = this.props.info.usersNickname;
    let users = this.props.info.users;

    let idToNickname = (player_id) => {
      return usersNickname[users.indexOf(player_id)];
    };
    let partyMemberList = this.props.info.users.map(idToNickname).join(', ');
    //MATCHES
    let matchesList = [];
    this.props.matches.map((match) => {
      let players = match.players.map(idToNickname).join(', ');
      let active = match.players.indexOf(currentUserId) > -1 &&
        match.status != 'Finished';

      matchesList.push((<ListItem
        key={match._id}
        primaryText={players}
        secondaryText={match.game_name + " - " + match.status}
        rightIcon={(active) ? <NavigationChevronRight /> :
                              <ImageRemoveRedEye />}
        style={{WebkitAppearance: 'inherit'}}
        onClick={joinMatch(match)}
      />))
    });

    // GAMES
    let gamesList = [];
    this.props.games.map((game) => {
      let downList = null;
      if (this.props.downMapping)
        downList = this.props.downMapping[game.code];
      let downCount = 0;
      let isChecked = false;
      if (downList) {
        downCount = downList.length;
        isChecked = downList.indexOf(currentUserId) > -1;
      }

      gamesList.push((<ListItem
        key={game.code}
        primaryText={game.name}
        secondaryText={downCount+"/"+game.maxPlayers+" players"}
        rightIcon={<PlacesCasino />}
        leftCheckbox={(game.loading) ?
          <CircularProgress size={30} thickness={5} />
          : <Checkbox checked={isChecked}/>}
        style={{WebkitAppearance: 'inherit'}}
        onClick={this.down(game)}
      />));
    })
    return (<TurnatoBar disconnected={this.props.disconnected}>
      <br />
      <Snackbar
        open={this.state.linkCopied}
        message="Link copied to clipboard"
        onRequestClose={() => this.setState({linkCopied: false})}
        autoHideDuration={4000}
      />
      <Card>
        <CardHeader
          title={partyName}
          subtitle={partyMemberCount+" members"}
        />
        <CardText>
          Members: {partyMemberList}
        </CardText>

        <CardActions style={{textAlign: "right"}}>
          <CopyToClipboard text={this.state.link}
            onCopy={() => this.setState({linkCopied: true})}>
            <RaisedButton label="Copy Invite Link" secondary={true} />
          </CopyToClipboard>
        </CardActions>
      </Card>
      <List>
        {(matchesList.length > 0) ?
          <Subheader>Active Matches</Subheader> :
          null }
        {matchesList}

        <Subheader>I&rsquo;m down for</Subheader>
        {gamesList}

      </List>
      </TurnatoBar>)
    }
}

PartyView.defaultProps = {
  joinParty: () => {},
  leaveParty: () => {},
  disconnected: false,
  down: () => {},
  token: '',
  info: {loading: true},
  matches: [],
  games: [],
  downMapping: {},
  params: {}
};

export default PartyView
