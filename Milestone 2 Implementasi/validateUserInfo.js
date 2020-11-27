function parseXML(n) {
	for (
		var a = -1, r = 0, e = 0, i = [], t = {}, s = -1;
		-1 !== (a = n.indexOf('<', a + 1)) && -1 !== (r = n.indexOf('>', a + 1));

	) {
		var c = n.substring(a, r + 1),
			l = c[1];
		if ('?' !== l && '/' !== l) {
			var o = !0;
			-1 === (e = c.indexOf(' ')) && ((e = c.length - 1), (o = !1)), (s = a + c.length);
			var u = '/' === c[c.length - 2],
				g = c.substring(1, e);
			if ((u || i.push(g), o)) {
				var v = c.match(/\w+\=\".*?\"/g);
				if (null !== v) {
					for (var b = {}, f = v.length, h = 0; h < f; h++) {
						var d = v[h].indexOf('"');
						b[v[h].substring(0, d - 1)] = v[h].substring(d + 1, v[h].length - 1);
					}
					t[i.join('.') + (u ? '.' + g : '') + '[]'] = b;
				}
			}
		} else {
			var p = i.pop();
			if (-1 === s || p !== c.substring(2, c.length - 1)) continue;
			var j = i.join('.') + '.' + p,
				x = n.substring(s, a);
			void 0 === t[j] ? (t[j] = x) : t[j] instanceof Array ? t[j].push(x) : (t[j] = [t[j], x]), (s = -1);
		}
	}
	return t;
}

var obj = parseXML(userInfo),
	userID = obj['USER.USER_DETAIL.id'];
isUserValid = !!userID;

// activiti:resultVariable="isUserValid"

var obj = parseXML(senderAccountBalanceOutput),
	accountBalance = obj['ACCOUNT.ACCOUNT_DETAIL.balance'];
extractedBalance = parseInt(accountBalance);

var xmlStr = user_info,
	xmlObj = parseXML(xmlStr),
	result = xmlObj['userCollection.user.name'];
validation = !!result;
