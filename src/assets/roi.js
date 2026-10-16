(function () {
  var f = document.querySelector('form[data-roi]');
  if (!f) return;
  var $ = function (n) { return parseFloat(f.elements[n].value) || 0; };
  var fmt = function (n) { return (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US'); };
  var out = function (k, v) { f.querySelector('[data-out="' + k + '"]').textContent = v; };
  var run = function () {
    var hires = $('hires'), wage = $('wage'), ramp = $('ramp'), faster = $('faster') / 100, turn = $('turn') / 100, red = $('turnred') / 100, rep = $('replace') / 100, cost = $('cost');
    var annual = wage * 2080, weekly = wage * 40;
    var rampValue = hires * (weekly * ramp / 2) * faster;
    var turnValue = hires * turn * red * annual * rep;
    var invest = hires * cost;
    var net = rampValue + turnValue - invest;
    out('ramp', fmt(rampValue)); out('turn', fmt(turnValue)); out('cost', fmt(invest)); out('net', fmt(net));
    out('roi', invest > 0 ? Math.round(net / invest * 100) + '%' : '—');
  };
  f.elements.role.addEventListener('change', function () { if (this.value) f.elements.wage.value = this.value; run(); });
  f.addEventListener('input', run);
  f.addEventListener('submit', function (e) { e.preventDefault(); run(); });
  run();
})();
