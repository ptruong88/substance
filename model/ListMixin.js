/* eslint-disable no-unused-vars */
import isArray from '../util/isArray'

const ERR_ABSTRACT = 'This method is abstract!'

export default function(DocumentNode) {

  class AbstractList extends DocumentNode {

    isList() {
      return true
    }

    createListItem(text) {
      throw new Error(ERR_ABSTRACT)
    }

    getItems() {
      throw new Error(ERR_ABSTRACT)
    }

    getItemsPath() {
      throw new Error(ERR_ABSTRACT)
    }

    insertItemAt(pos, item) {
      throw new Error(ERR_ABSTRACT)
    }

    removeItemAt(pos) {
      throw new Error(ERR_ABSTRACT)
    }

    // general

    getItemAt(idx) {
      return this.getItems()[idx]
    }

    getItemPosition(item) {
      return this.getItems().indexOf(item)
    }

    getLength() {
      return this.getItems().length
    }

    getFirstItem() {
      return this.getItemAt(0)
    }

    getLastItem() {
      return this.getItemAt(this.getLength()-1)
    }

    appendItem(item) {
      this.insertItemAt(this.items.length, item)
    }

    removeItem(item) {
      const pos = this.getItemPosition(item)
      if (pos >= 0) {
        this.removeItemAt(pos)
      }
    }

    isEmpty() {
      return this.getLength() === 0
    }

    get length() {
      return this.getLength()
    }

    getListType(level) {
      let levelTypes = this.getLevelTypes()
      return levelTypes[level] || 'bullet'
    }

    _getLevelTypes(levelTypeStr) {
      return levelTypeStr ? levelTypeStr.split(',').map(s => s.trim()) : []
    }

    setLevelTypes(levelTypeStr) {
      if (isArray(levelTypeStr)) {
        levelTypeStr = levelTypeStr.join(',')
      }
      this._setLevelTypes(levelTypeStr)
    }

  }

  return AbstractList
}