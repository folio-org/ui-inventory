import {
  AND,
  NOT,
  OR,
  PROX
} from './constants';

const cqlParser = (intl) => {
  // CQLBoolean
  const CQLBoolean = function CQLBoolean() {
    this.op = null;
    this.modifiers = null;
    this.left = null;
    this.right = null;
  };

  CQLBoolean.prototype = {
    toString() {
      return `${this.left.op ? `(${this.left})` : this.left} ` +
        `${this.op.toUpperCase()}` +
        `${this.modifiers.length > 0 ? `/${this.modifiers.join('/')}` : ''}` +
        ` ${this.right.op ? `(${this.right})` : this.right}`;
    }
  };

  // CQLModifier
  const CQLModifier = function CQLModifier() {
    this.name = null;
    this.relation = null;
    this.value = null;
  };

  // CQLSearchClause
  const CQLSearchClause = function CQLSearchClause(field, fielduri, relation, relationuri, modifiers, term, scf, scr) {
    this.field = field;
    this.fielduri = fielduri;
    this.relation = relation;
    this.relationuri = relationuri;
    this.modifiers = modifiers;
    this.term = term;
    this.scf = scf;
    this.scr = scr;
  };

  CQLSearchClause.prototype = {
    toString() {
      let field = this.field;
      let relation = this.relation;
      if (field === this.scf && relation === this.scr) {
        // avoid redundant field/relation
        field = null;
        relation = null;
      }
      return `${field ? `${field} ` : ''}` +
        `${relation || ''}` +
        `${this.modifiers.length > 0 ? `/${this.modifiers.join('/')}` : ''}` +
        `${relation || this.modifiers.length ? ' ' : ''}` +
        `"${this.term}"`;
    }
  };

  // CQLParser
  const CQLParser = function CQLParser() {
    this.qi = null;
    this.ql = null;
    this.qs = null;
    this.look = null;
    this.lval = null;
    this.val = null;
    this.prefixes = {};
    this.tree = null;
    this.scf = '';
    this.scr = '';
  };

  CQLParser.prototype = {
    parse(query) {
      if (!query) throw new Error(intl.formatMessage({ id: 'ui-inventory.parser.emptyQuery' }));
      this.qs = query;
      this.ql = this.qs.length;
      this.qi = 0;
      this._move();
      this.tree = this._parseQuery(this.scf, this.scr, []);
      if (this.look !== '') throw new Error(intl.formatMessage({ id: 'ui-inventory.parser.eof' }));
    },
    toString() {
      return this.tree.toString();
    },
    _parseQuery(field, relation, modifiers) {
      let left = this._parseSearchClause(field, relation, modifiers);
      while (this.look === 's' && (
        this.lval === AND.toLowerCase() ||
        this.lval === OR.toLowerCase() ||
        this.lval === NOT.toLowerCase() ||
        this.lval === PROX.toLowerCase())) {
        const b = new CQLBoolean();
        b.op = this.lval;
        this._move();
        b.modifiers = this._parseModifiers();
        b.left = left;
        b.right = this._parseSearchClause(field, relation, modifiers);
        left = b;
      }
      return left;
    },
    _parseModifiers() {
      const ar = [];
      while (this.look === '/') {
        this._move();
        if (this.look !== 's' && this.look !== 'q') {
          throw new Error(intl.formatMessage({ id: 'ui-inventory.parser.invalidModifier' }));
        }
        const name = this.lval;
        this._move();
        if (this.look.length > 0
          && '<>='.includes(this.look.charAt(0))) {
          const rel = this.look;
          this._move();
          if (this.look !== 's' && this.look !== 'q') {
            throw new Error(intl.formatMessage({ id: 'ui-inventory.parser.invalidRelation' }));
          }
          const m = new CQLModifier();
          m.name = name;
          m.relation = rel;
          m.value = this.val;
          ar.push(m);
          this._move();
        } else {
          const m = new CQLModifier();
          m.name = name;
          m.relation = '';
          m.value = '';
          ar.push(m);
        }
      }
      return ar;
    },
    _parseSearchClause(field, relation, modifiers) {
      if (this.look === '(') {
        this._move();
        const b = this._parseQuery(field, relation, modifiers);
        if (this.look === ')') {
          this._move();
        } else {
          // the parsing also happens correctly without the closing parentheses
          // throw new Error(intl.formatMessage({ id: 'ui-inventory.parser.missingCloseParenthesis' }));
        }
        return b;
      } else if (this.look === 's' || this.look === 'q') {
        const first = this.val;   // dont know if field or term yet
        this._move();
        if (this.look === 'q' ||
          (this.look === 's' &&
            this.lval !== AND.toLowerCase() &&
            this.lval !== OR.toLowerCase() &&
            this.lval !== NOT.toLowerCase() &&
            this.lval !== PROX.toLowerCase())) {
          const rel = this.val;    // string relation
          this._move();
          return this._parseSearchClause(first, rel, this._parseModifiers());
        } else if (this.look.length > 0 && '<>='.includes(this.look.charAt(0))) {
          const rel = this.look;   // other relation <, = ,etc
          this._move();
          return this._parseSearchClause(first, rel, this._parseModifiers());
        } else {
          // it's a search term
          let pos = field.indexOf('.');
          let pre = '';
          if (pos !== -1) {
            pre = field.substring(0, pos);
          }
          const uri = this._lookupPrefix(pre);
          if (uri.length > 0) {
            // eslint-disable-next-line
            field = field.substring(pos + 1);
          }
          pos = relation.indexOf('.');
          if (pos === -1) {
            pre = 'cql';
          } else {
            pre = relation.substring(0, pos);
          }
          const reluri = this._lookupPrefix(pre);
          if (reluri.length > 0) {
            // eslint-disable-next-line
            relation = relation.substring(pos + 1);
          }
          return new CQLSearchClause(field, uri, relation, reluri, modifiers, first, this.scf, this.scr);
        }
        // prefixes
      } else if (this.look === '>') {
        this._move();
        if (this.look !== 's' && this.look !== 'q') {
          throw new Error(intl.formatMessage({ id: 'ui-inventory.parser.strOrQuotedExpression' }));
        }
        const first = this.lval;
        this._move();
        if (this.look === '=') {
          this._move();
          if (this.look !== 's' && this.look !== 'q') {
            throw new Error(intl.formatMessage({ id: 'ui-inventory.parser.strOrQuotedExpression' }));
          }
          this._addPrefix(first, this.lval);
          this._move();
          return this._parseQuery(field, relation, modifiers);
        } else {
          this._addPrefix('default', first);
          return this._parseQuery(field, relation, modifiers);
        }
      } else {
        throw new Error(intl.formatMessage({ id: 'ui-inventory.parser.invalidSearchClause' }));
      }
    },
    _move() {
      // eat whitespace
      while (this.qi < this.ql && ' \t\r\n'.includes(this.qs.charAt(this.qi))) {
        this.qi++;
      }
      // eof
      if (this.qi === this.ql) {
        this.look = '';
        return;
      }
      // current char
      const c = this.qs.charAt(this.qi);
      // separators
      if ('()/'.includes(c)) {
        this.look = c;
        this.qi++;
        // comparitor
      } else if ('<>='.includes(c)) {
        this.look = c;
        this.qi++;
        // comparitors can repeat, could be if
        while (this.qi < this.ql && '<>='.includes(this.qs.charAt(this.qi))) {
          this.look += this.qs.charAt(this.qi);
          this.qi++;
        }
        // quoted string
      } else if ('"\''.includes(c)) {
        this.look = 'q';
        // remember quote char
        const mark = c;
        this.qi++;
        this.val = '';
        let escaped = false;
        while (this.qi < this.ql) {
          if (!escaped && this.qs.charAt(this.qi) === mark) {
            break;
          }
          if (!escaped && this.qs.charAt(this.qi) === '\\') {
            escaped = true;
          } else {
            escaped = false;
          }
          this.val += this.qs.charAt(this.qi);
          this.qi++;
        }
        this.lval = this.val.toLowerCase();
        if (this.qi < this.ql) {
          this.qi++;
        } else { // unterminated
          this.look = ''; // notify error
        }
        // unquoted string
      } else {
        this.look = 's';
        this.val = '';
        while (this.qi < this.ql
        && !'()/<>= \t\r\n'.includes(this.qs.charAt(this.qi))) {
          this.val += this.qs.charAt(this.qi);
          this.qi++;
        }
        this.lval = this.val.toLowerCase();
      }
    },
    _lookupPrefix(name) {
      return this.prefixes[name] ? this.prefixes[name] : '';
    },
    _addPrefix(name, value) {
      // overwrite existing items
      this.prefixes[name] = value;
    }
  };

  return new CQLParser();
};

export default cqlParser;
