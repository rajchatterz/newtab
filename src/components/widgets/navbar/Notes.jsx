import { PureComponent } from 'react';
import { FileCopyRounded, AssignmentRounded as NotesRounded, PushPin }from '@material-ui/icons';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { toast } from 'react-toastify';
import Hotkeys from 'react-hot-keys';

export default class Notes extends PureComponent {
  constructor() {
    super();
    this.state = {
      notes: localStorage.getItem('notes') || '',
      visibility: (localStorage.getItem('notesPinned') === 'true') ? 'visible' : 'hidden'
    };
    this.language = window.language.widgets.navbar.notes;
  }

  setNotes = (e) => {
    localStorage.setItem('notes', e.target.value);
    this.setState({
      notes: e.target.value
    });
  };

  pin() {
    window.stats.postEvent('feature', 'Notes pin');

    if (localStorage.getItem('notesPinned') === 'true') {
      localStorage.setItem('notesPinned', false);
      this.setState({
        visibility: 'hidden'
      });
    } else {
      localStorage.setItem('notesPinned', true);
      this.setState({
        visibility: 'visible'
      });
    }
  }

  copy() {
    window.stats.postEvent('feature', 'Notes copied');
    navigator.clipboard.writeText(this.state.notes);
    toast(window.language.toasts.notes);
  }

  componentDidMount() {
    if (localStorage.getItem('refresh') === 'false') {
      document.getElementById('noteContainer').style.marginLeft = '-200px';
    }
  }

  render() {
    const notes = (
        <span id='noteContainer' className='notescontainer' style={{ visibility: this.state.visibility }}>
        <div className='topbarnotes'>
          <NotesRounded/>
          <h3>{this.language.title}</h3>
        </div>
        <TextareaAutosize rowsmax={50} placeholder={this.language.placeholder} value={this.state.notes} onChange={this.setNotes}/>
        <button onClick={() => this.pin()} className='pinNote'><PushPin/></button>
        <button onClick={() => this.copy()} className='copyNote'><FileCopyRounded/></button>
      </span>
    );
    
    if (window.keybinds.pinNotes && window.keybinds.pinNotes !== '') {
      return (
        <Hotkeys keyName={window.keybinds.pinNotes} onKeyDown={() => this.pin()}>
          {notes}
        </Hotkeys>
      );
    } else {
      return notes;
    }
  }
}
