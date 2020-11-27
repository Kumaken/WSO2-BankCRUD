function _instanceof(t, e) {
	return null != e && 'undefined' != typeof Symbol && e[Symbol.hasInstance]
		? !!e[Symbol.hasInstance](t)
		: t instanceof e;
}
function _typeof(t) {
	return (_typeof =
		'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
			? function (t) {
					return typeof t;
			  }
			: function (t) {
					return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
						? 'symbol'
						: typeof t;
			  })(t);
}
var pjXML = (function () {
	var t = {},
		e = 1,
		n = 7,
		i = 8,
		s = 9;
	function r(t) {
		(this.xml = t),
			(this.entities = { lt: '<', gt: '>', amp: '&', apos: "'", quot: '"' }),
			(this.pos = 0),
			(this.inDTD = !1);
	}
	function o(t) {
		(this.type = t), (this.content = []);
	}
	function p(t, e) {
		for (var n = '', i = 0; i < t.content.length; i++) {
			var s = t.content[i];
			n += 'string' == typeof s ? r.escapeXML(s) : s[e]();
		}
		return n;
	}
	return (
		(r.isSpace = function (t) {
			return ' \t\n\r'.indexOf(t) >= 0;
		}),
		(r.isMarkup = function (t) {
			return '<>?!&='.indexOf(t) >= 0;
		}),
		(r.escapeMap = { '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }),
		(r.escapeXML = function (t) {
			return t.replace(/([<>&'"])/g, function (t, e) {
				return '&' + r.escapeMap[e] + ';';
			});
		}),
		(r.prototype.read = function (t) {
			return this.pos < this.xml.length ? this.xml[this.pos++] : null;
		}),
		(r.prototype.peek = function () {
			return this.pos < this.xml.length ? this.xml[this.pos] : null;
		}),
		(r.prototype.consume = function (t) {
			return this.peek() == t ? this.read() : null;
		}),
		(r.prototype.eof = function () {
			return this.pos >= this.xml.length;
		}),
		(r.prototype.skip = function (t) {
			return (this.pos = Math.min(this.xml.length, this.pos + t)), this.eof();
		}),
		(r.prototype.getEntity = function (t) {
			if ('#' == t[0]) {
				var e = 'x' == t[1] ? parseInt(t.substring(2), 16) : parseInt(t.substring(1));
				t = String.fromCharCode(e);
			} else this.entities[t] && (t = this.entities[t]);
			return t;
		}),
		(r.prototype.replaceEntities = function (t) {
			var e = this;
			return t.replace(/&([^;]*);/g, function (t, n) {
				return e.getEntity(n);
			});
		}),
		(r.prototype.nextChar = function () {
			if (this.pos >= this.xml.length) return null;
			var t = this.read();
			if ('&' == t || (this.inDTD && '%' == t)) {
				for (var e = ''; ';' != (t = this.read()) && t; ) e += t;
				t = this.getEntity(e);
			}
			return t;
		}),
		(r.prototype.readString = function (t) {
			for (var e, n = ''; n.length < t && (e = this.nextChar()); ) n += e;
			return n.length > t ? n.substring(0, t) : n;
		}),
		(r.prototype.peekString = function (t) {
			var e = this.pos,
				n = this.readString(t);
			return (this.pos = e), n;
		}),
		(r.prototype.consumeString = function (t) {
			return this.peekString(t.length) == t && (this.readString(t.length), !0);
		}),
		(r.prototype.consumeUntil = function (t) {
			for (var e, n = ''; (e = this.nextChar()); ) {
				if (e == t[0] && this.consumeString(t.substring(1))) return n;
				n += e;
			}
			return n;
		}),
		(r.prototype.skipSpace = function () {
			for (; r.isSpace(this.peek()); ) this.read();
		}),
		(r.prototype.readName = function () {
			for (var t, e = ''; (t = this.peek()) && !r.isSpace(t) && !r.isMarkup(t); ) e += this.read();
			return e;
		}),
		(r.prototype.readQuotedString = function () {
			var t,
				e,
				n = '';
			for (e = this.read(); (t = this.read()) && t != e; ) n += t;
			return n;
		}),
		(r.prototype.parseExternalID = function () {
			this.consumeString('SYSTEM')
				? (this.skipSpace(), this.readString())
				: this.consumeString('PUBLIC') &&
				  (this.skipSpace(), this.readQuotedString(), this.skipSpace(), this.readQuotedString());
		}),
		(r.prototype.parseEntityDecl = function () {
			this.skipSpace(), '%' == this.peek() && this.read(), this.skipSpace();
			var t = this.readName();
			this.skipSpace();
			var e = this.replaceEntities(this.readQuotedString());
			this.consumeUntil('>'), (this.entities[t] = e);
		}),
		(r.prototype.parseDecl = function () {
			if ((this.consumeString('<!'), '[' == this.peek()))
				if (this.consumeString('[INCLUDE['))
					for (this.skipSpace(); !this.consumeString(']]>'); ) this.parseDecl(), this.skipSpace();
				else this.consumeUntil(']]>');
			else this.consumeString('ENTITY') ? this.parseEntityDecl() : this.consumeUntil('>');
		}),
		(r.prototype.parseDTD = function () {
			if (
				((this.inDTD = !0),
				this.skipSpace(),
				this.readName(),
				this.skipSpace(),
				this.parseExternalID(),
				this.skipSpace(),
				this.consumeString('>'))
			)
				this.inDTD = !1;
			else {
				if (!this.consumeString('[')) return this.consumeUntil('>'), void (this.inDTD = !1);
				for (this.skipSpace(); !this.consumeString(']'); ) this.parseDecl(), this.skipSpace();
				this.consumeUntil('>'), (this.inDTD = !1);
			}
		}),
		(o.prototype.append = function (t) {
			switch (_typeof(t)) {
				case 'string':
					if (this.content.length && 'string' == typeof this.content[this.content.length - 1])
						return void (this.content[this.content.length - 1] += t);
			}
			return this.content.push(t), this;
		}),
		(o.prototype.parse = function (t) {
			for (var s = ''; (a = t.nextChar()); )
				if ('<' == a)
					switch ((this.append(s), (s = ''), (a = t.nextChar()))) {
						case '!':
							if (t.consumeString('--')) {
								var r = new o(i);
								r.append(t.consumeUntil('--\x3e')), this.append(r);
							} else
								t.consumeString('[CDATA[')
									? this.append(t.consumeUntil(']]>'))
									: t.consumeString('DOCTYPE') && t.parseDTD();
							break;
						case '?':
							var p = new o(n);
							p.append(t.consumeUntil('?>')), this.append(p);
							break;
						case '/':
							return void t.consumeUntil('>');
						default:
							var a,
								u = new o(e);
							for (
								u.name = a + t.readName(), u.attributes = {};
								(a = t.peek()) && '/' != a && '>' != a;

							) {
								t.skipSpace();
								var h = t.readName();
								t.consumeString('='), (u.attributes[h] = t.replaceEntities(t.readQuotedString()));
							}
							'/' == a ? t.consumeString('/>') : '>' == a && (t.nextChar(), u.parse(t)), this.append(u);
					}
				else s += a;
			s.length && this.append(s);
		}),
		(o.prototype.select = function (t) {
			if (
				(Array.isArray(t) ||
					(t = (t = t.replace('//', '/>').split('/')).reduce(function (t, e) {
						return e && t.push(e), t;
					}, [])),
				t.length < 1)
			)
				return [];
			if ('@' == t[0][0]) return this.attributes ? [this.attributes[t[0].substr(1)]] : [];
			var e = [],
				n = t[0],
				i = '>' == n[0],
				s = i ? n.substr(1) : n,
				r = this.elements(s);
			return (
				t.length > 1
					? r.map(function (n) {
							e = e.concat(n.select(t.slice(1)));
					  })
					: (e = e.concat(r)),
				i &&
					this.elements().map(function (n) {
						e = e.concat(n.select(t));
					}),
				1 == e.length ? e[0] : e
			);
		}),
		(o.prototype.firstElement = function () {
			for (var t = 0; t < this.content.length; t++) {
				var n = this.content[t];
				if (_instanceof(n, o) && n.type == e) return n;
			}
			return null;
		}),
		(o.prototype.elements = function (t) {
			return this.content.reduce(function (n, i) {
				return !_instanceof(i, o) || i.type != e || (t && '*' != t && i.name != t) || n.push(i), n;
			}, []);
		}),
		(o.prototype.text = function () {
			return p(this, 'text');
		}),
		(o.prototype.xml = function () {
			var t = '';
			switch (this.type) {
				case e:
					if (((t += '<' + this.name), this.attributes))
						for (var s in this.attributes)
							this.attributes.hasOwnProperty(s) &&
								(t += ' ' + s + '="' + r.escapeXML(this.attributes[s]) + '"');
					this.content.length
						? ((t += '>'), (t += p(this, 'xml')), (t += '</' + this.name + '>'))
						: (t += '/>');
					break;
				case n:
				case i:
					break;
				default:
					t = p(this, 'xml');
			}
			return t;
		}),
		(t.parse = function (t) {
			var e = new r(t),
				n = new o(s);
			return n.parse(e), n;
		}),
		t
	);
})();
var doc = pjXML.parse(StartPaymentResponse);
var processID = doc.select('//id');
execution.setVariable('ProcessID', processID.content[0]);
