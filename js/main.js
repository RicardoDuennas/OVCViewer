async function fetchOVCData(id) {
  const res = await fetch('data/ovc.json');
  const data = await res.json();
  return data.find(item => item.id === id);
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function displayOVC() {
  const id = getQueryParam('id');
  if (!id) {
    document.getElementById('nombre').innerText = 'ID no especificado en la URL.';
    return;
  }

  const ovc = await fetchOVCData(id);

  if (!ovc) {
    document.getElementById('nombre').innerText = 'Elemento no encontrado.';
    return;
  }

  document.getElementById('nombre').innerText = ovc.nombre;
  document.getElementById('imagen').src = ovc.imagen;
  document.getElementById('imagen').alt = ovc.nombre;
  document.getElementById('autores').innerText = ovc.autores.join(', ');
  document.getElementById('categoria').innerText = ovc.categoria;
  document.getElementById('descripcion').innerText = ovc.descripcion;
}

displayOVC();
