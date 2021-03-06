import DataNode from './Node'
import isString from '../util/isString'

/**
  Base node type for document nodes.

  @example

  The following example shows how a new node type is defined.

  ```js
  class Todo extends TextBlock {}
  Todo.schema = {
    type: 'todo',
    content: 'text',
    done: { type: 'bool', default: false }
  }
  ```

  The following data types are supported:

  - `string` bare metal string data type
  - `text` a string that carries annotations
  - `number` numeric values
  - `bool` boolean values
  - `id` a node id referencing another node in the document
*/
export default
class DocumentNode extends DataNode {
  _initialize (doc, props) {
    this.document = doc
    super._initialize(props)
  }

  /**
    Get the Document instance.

    @returns {Document}
  */
  getDocument () {
    return this.document
  }

  /**
    Whether this node has a parent.

    `parent` is a built-in property for implementing nested nodes.

    @returns {Boolean}
  */
  hasParent () {
    return Boolean(this.parent)
  }

  /**
    @returns {DocumentNode} the parent node
  */
  getParent () {
    if (isString(this.parent)) return this.document.get(this.parent)
    return this.parent
  }

  setParent (parent) {
    if (isString(parent)) parent = this.document.get(parent)
    this.parent = parent
  }

  /**
    Get the root node.

    The root node is the last ancestor returned
    by a sequence of `getParent()` calls.

    @returns {DocumentNode}
  */
  getRoot () {
    let node = this
    while (node.parent) {
      node = node.parent
    }
    return node
  }

  getContainerRoot () {
    let node = this
    while (node.parent) {
      // stop if node is immediate child of a container
      if (node.parent.isContainer()) return node
      // oherwise traverse up
      node = node.parent
    }
    return node
  }

  /**
    Checks whether this node has children.

    @returns {Boolean} default: false
  */
  hasChildren () {
    return false
  }

  /**
    Get the index of a given child.

    @returns {Number} default: -1
  */
  getChildIndex(child) { // eslint-disable-line
    return -1
  }

  /**
    Get a child node at a given position.

    @returns {DocumentNode} default: null
  */
  getChildAt(idx) { // eslint-disable-line
    return null
  }

  /**
    Get the number of children nodes.

    @returns {Number} default: 0
  */
  getChildCount () {
    return 0
  }

  // Node categories
  // --------------------

  /**
   * An anchor is an inline-node with zero-width.
   */
  isAnchor () {
    return this.constructor.isAnchor()
  }

  /**
   * An annotation has a `start` and an `end` coordinate that is used to anchor it within the document.
   */
  isAnnotation () {
    return this.constructor.isAnnotation()
  }

  /**
   * @returns {Boolean} true if node is a block node (e.g. Paragraph, Figure, List, Table)
   */
  isBlock () {
    // TODO: This category did not help too much.
    // Find out if we can get rid of this. Essentially everything which is not an annotation or an inline node is a block
    return this.constructor.isBlock()
  }

  /**
   * A DocumentNode with a sequence of child nodes.
   */
  isContainer () {
    return this.constructor.isContainer()
  }

  /**
   * A ContainerAnnotation may span over multiple nodes, i.e. `start` and `end` may be located on different text nodes within a Container.
   */
  isContainerAnnotation () {
    return this.constructor.isContainerAnnotation()
  }

  /**
   * @returns {Boolean} true if node is an inline node (e.g. Inline Formula)
   *
   * > Attention: InlineNodes are substantially different to Annotations, as they **own** their content.
   *  In contrast, annotations do not own the content, they are just 'overlays' to text owned by other nodes.
   */
  isInlineNode () {
    return this.constructor.isInlineNode()
  }

  /**
   * A DocumentNode used for modelling a List, consisting of a list of ListItems and a definition of ordering types.
   */
  isList () {
    return this.constructor.isList()
  }

  /**
   * A ListItem is may only be a direct child of a ListNode and should be a TextNode.
   */
  isListItem () {
    return this.constructor.isListItem()
  }

  /**
   * A PropertyAnnotation is an Annotation that is anchored to a single text property.
   */
  isPropertyAnnotation () {
    return this.constructor.isPropertyAnnotation()
  }

  /**
    @returns {Boolean} true if node is a text node (e.g. Paragraph, Codebock)
  */
  isText () {
    return this.constructor.isText()
  }

  // actual implementations are static

  static isAnchor () { return false }

  static isAnnotation () { return false }

  /**
    Declares a node to be treated as block-type node.

    BlockNodes are considers the direct descendant of `Container` nodes.
    @type {Boolean} default: false
  */
  static isBlock () { return false }

  static isContainer () { return false }

  /**
    Declares a node to be treated as {@link model/ContainerAnnotation}.

    @type {Boolean} default: false
  */
  static isContainerAnnotation () { return false }

  /**
   * Declares a node to be treated as {@link model/InlineNode}.
   *
   * @type {Boolean} default: false
   */
  static isInlineNode () { return false }

  static isList () { return false }

  static isListItem () { return false }

  /**
   * Declares a node to be treated as {@link model/PropertyAnnotation}.
   *
   * @type {Boolean} default: false
   */
  static isPropertyAnnotation () { return false }

  /**
    Declares a node to be treated as text-ish node.

    @type {Boolean} default: false
  */
  static isText () { return false }

  // used for 'instanceof' comparison
  get _isDocumentNode () { return true }
}
