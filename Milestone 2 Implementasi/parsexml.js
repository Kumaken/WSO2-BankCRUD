function parseXML(r) {
	for (
		var n = -1, e = 0, t = 0, i = [], s = {}, a = -1;
		-1 !== (n = r.indexOf('<', n + 1)) && -1 !== (e = r.indexOf('>', n + 1));

	) {
		var l = r.substring(n, e + 1),
			u = l[1];
		if ('?' !== u && '/' !== u) {
			var g = !0;
			-1 === (t = l.indexOf(' ')) && ((t = l.length - 1), (g = !1)), (a = n + l.length);
			var f = '/' === l[l.length - 2],
				o = l.substring(1, t);
			if ((f || i.push(o), g)) {
				var v = l.match(/\w+\=\".*?\"/g);
				if (null !== v) {
					for (var h = {}, b = v.length, x = 0; x < b; x++) {
						var d = v[x].indexOf('"');
						h[v[x].substring(0, d - 1)] = v[x].substring(d + 1, v[x].length - 1);
					}
					s[i.join('.') + (f ? '.' + o : '') + '[]'] = h;
				}
			}
		} else {
			var m = i.pop();
			if (-1 === a || m !== l.substring(2, l.length - 1)) continue;
			var p = i.join('.') + '.' + m,
				O = r.substring(a, n);
			void 0 === s[p] ? (s[p] = O) : s[p] instanceof Array ? s[p].push(O) : (s[p] = [s[p], O]), (a = -1);
		}
	}
	return s;
}
var xmlObj = parseXML(accountBalanceOutput),
	result = xmlObj['ACCOUNT.ACCOUNT_DETAIL.balance'];
NewAccountBalance = void 0 !== parseInt(result);
