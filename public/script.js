$(function () {
  $("#search-student").on("keyup", function () {
    var value = $(this).val();
    var data = searchTable(value, student);
    buildTable(data);
  });
  // $("#search-lab").on("keyup", function () {
  //   var value = $(this).val();
  //   var data = searchTable(value, student);
  //   buildTableLab(data);
  // });
  $("#search-TPG").on("keyup", function () {
    var value = $(this).val();
    var data = searchTable(value, student);
    buildTableTPG(data);
  });
  function searchTable(value, data) {
    var filteredData = [];
    for (var i = 0; i < data.length; i++) {
      value = value.toLowerCase();
      var apellido = data[i].apellido.toLowerCase();
      var nombre = data[i].nombre.toLowerCase();
      var carrera = data[i].carrera.toLowerCase();
      var registro = data[i].registro.toLowerCase();
      var dni = data[i].dni.toLowerCase();
      var email = data[i].email.toLowerCase();
      if (
        apellido.includes(value) ||
        nombre.includes(value) ||
        carrera.includes(value) ||
        registro.includes(value) ||
        dni.includes(value) ||
        email.includes(value)
      ) {
        filteredData.push(data[i]);
      }
    }
    return filteredData;
  }
  $("#grupoTPG").on("keyup", function () {
    grupoTPG = $(this).val();
  });
  // $("#numlab").on("keyup", function () {
  //   numlab = $(this).val();
  // });
  // $("#fecha").on("keyup", function () {
  //   fecha = $(this).val();
  // });
  // $("#comision").on("keyup", function () {
  //   comision = $(this).val();
  // });
  // $("#horaInicio").on("keyup", function () {
  //   horaInicio = $(this).val();
  // });
  // $("#horaFinal").on("keyup", function () {
  //   horaFinal = $(this).val();
  // });
});
