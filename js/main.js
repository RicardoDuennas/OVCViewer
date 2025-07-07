function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function loadJSON(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error loading ${url}`);
  return await response.json();
}

function createRelationHTML(relatedOVC, relationName) {
  const div = document.createElement('div');
  div.className = 'relation';
  div.innerHTML = `<strong>${relationName}:</strong> <a href="?id=${relatedOVC.id}">${relatedOVC.nombre}</a>`;
  return div;
}

async function displayOVC() {
  const id = getQueryParam('id');
  if (!id) {
    document.getElementById('nombre').innerText = 'ID no especificado en la URL.';
    return;
  }

  let ovcs = [];
  let relations = [];

  try {
    [ovcs, relations] = await Promise.all([
      loadJSON('data/ovc.json'),
      loadJSON('data/relations.json')
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
    document.getElementById('nombre').innerText = 'Error cargando los datos.';
    return;
  }

  const ovc = ovcs.find(item => item.id === id);
  if (!ovc) {
    document.getElementById('nombre').innerText = 'Elemento no encontrado.';
    return;
  }

  // Fill main info
  document.getElementById('nombre').innerText = ovc.nombre;
  document.getElementById('imagen').src = ovc.imagen;
  document.getElementById('imagen').alt = ovc.nombre;
  document.getElementById('autores').innerText = ovc.autores.join(', ');
  document.getElementById('categoria').innerText = ovc.categoria;
  document.getElementById('descripcion').innerText = ovc.descripcion;

  // Handle relations
  const relatedDiv = document.getElementById('relaciones');
  relatedDiv.innerHTML = ''; // clear "Cargando..."

  const relatedItems = [];

  relations.forEach(rel => {
    let relatedId = null;
    if (rel.Direccion === 'Bidireccional') {
      if (rel.idOVC1 === id) relatedId = rel.idOVC2;
      else if (rel.idOVC2 === id) relatedId = rel.idOVC1;
    } else if (rel.Direccion === `${rel.idOVC1} a ${rel.idOVC2}` && rel.idOVC1 === id) {
      relatedId = rel.idOVC2;
    } else if (rel.Direccion === `${rel.idOVC2} a ${rel.idOVC1}` && rel.idOVC2 === id) {
      relatedId = rel.idOVC1;
    }

    if (relatedId) {
      const relatedOVC = ovcs.find(o => o.id === relatedId);
      if (relatedOVC) {
        relatedItems.push(createRelationHTML(relatedOVC, rel.nombreRelacion));
      }
    }
  });

  if (relatedItems.length > 0) {
    relatedItems.forEach(item => relatedDiv.appendChild(item));
  } else {
    relatedDiv.innerText = 'No hay relaciones registradas.';
  }
}

displayOVC();
