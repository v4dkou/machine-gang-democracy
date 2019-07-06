import { action, mst, shim } from 'classy-mst'
import { getEnv, Instance, types } from 'mobx-state-tree'
// import { loadString, saveString } from '../../components/storage'
import { formError } from '../../components/utils/error-utils'
import promiseTimer from '../../components/utils/promise-timer'
import { Environment } from '../app/environment'
import { Note } from '../services/database/schemas/note'
import { T } from '../style/values'

// tslint:disable-next-line:variable-name
const NoteStoreData = types.model({
  noteList: types.array(types.frozen<Note>()),
})

// tslint:disable-next-line:variable-name
const DemoNote = {
  id: 11,
  title: 'Title',
  description: 'Description',
} as Note

class NoteActions extends shim(NoteStoreData) {
  // @ts-ignore
  private get env() {
    return getEnv(this) as Environment
  }

  public fetchNoteList(): Promise<void> {
    return promiseTimer(2000)
      .then(data => {
        this.setNoteList([DemoNote])
        return Promise.resolve()
      })
      .catch(error => {
        console.tron.log(`NoteList error: ${JSON.stringify(error)}`)
        return Promise.reject(formError(error, T.string.get_note_list_error))
      })
  }

  @action
  public setNoteList(noteList: Note[]) {
    this.noteList.clear()
    noteList.forEach(item => {
      this.noteList.unshift({ ...item })
    })
  }

  // @action
  // private setNewNote(note: Note) {
  //   this.noteList.unshift({ ...note })
  // }
  //
  // @action
  // private setUpdatingNote(note: Note) {
  //   const updatedNotePosition = this.noteList.findIndex(
  //     item => item.id === note.id,
  //   )
  //   if (updatedNotePosition >= 0) {
  //     this.noteList[updatedNotePosition] = { ...note }
  //   }
  // }
  //
  // @action
  // private deleteNoteFromList(note: Note) {
  //   this.noteList.remove(note)
  // }
}

// tslint:disable-next-line:variable-name
export const NoteStoreModel = mst(NoteActions, NoteStoreData, 'NoteStore')

export type NoteStore = Instance<typeof NoteStoreModel>
