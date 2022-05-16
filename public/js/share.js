function query() {
    $("#table").bootstrapTable("refresh");
    $("#table").bootstrapTable({
        ajax: function (request) {
            $.ajax({
                url: "http://127.0.0.1:5000/query",
                type: "POST",
                dataType: "json",
                data: {
                    date: $("#date").val(),
                    weathertype: $("#weathertype").val(),
                    // forecasttime: $("#forecasttime").val(),
                },
                // headers:{
                //     'Authorization':window.localStorage.getItem("token")
                // },
                beforeSend: function (request) {
                  request.setRequestHeader("Authorization", window.localStorage.getItem("token"));
                },
                success: function (res) {
                    if(res["code"] === 4101 || res["code"] === 4103) {
                        alert("登录已过期，请登录");
                    }
                    let datarows = [];
                    let index = res.index;
                    for (i = 1; i <= index; i++) {
                        datarow = {};
                        let field = "data" + i;
                        datarow.date = res[field].header.refTime;
                        datarow.weathertype = res[field].header.parameterNumberName;
                        datarow.forecasttime = res[field].header.forecastTime;
                        datarow.heightlevel = res[field].header.surface1Value;
                        datarow.parameterUnit = res[field].header.parameterUnit;
                        datarow.data = res[field].data;
                        datarows.push(datarow);
                    }

                    request.success({
                        row: res,
                    });
                    $("#table").bootstrapTable("load", datarows);
                },
                error: function (error) {
                    console.log(error);
                },
            });
        },
        columns: [
            {
                field: "select",
                title: "全选",
                align: "center",
                halign: "center",
                checkbox: true,
            },
            {
                field: "date",
                title: "日期",
                align: "center",
                halign: "center",
            },
            {
                field: "weathertype",
                title: "气象类型",
                align: "center",
                halign: "center",
            },
            {
                field: "forecasttime",
                title: "预测时间/h",
                align: "center",
                halign: "center",
            },
            {
                field: "heightlevel",
                title: "距离地面高度/m",
                align: "center",
                halign: "center",
            },
            {
                field: "parameterUnit",
                title: "单位",
                align: "center",
                halign: "center",
            },
            {
                title: "操作",
                align: "center",
                formatter: function () {
                    return (
                        '<button id="details" type="button" class="btn btn-info btngroup" data-target:"#myModal">详情</button>' +
                        "&nbsp;&nbsp;" +
                        '<button id="download" type="button" class="btn btn-info btngroup">下载</button>'
                    );
                },
                events: {
                    "click #details": function (e, value, row, index) {
                        $("#myModal").modal();
                        let stringify = JSON.stringify(row, null, 2);
                        // $("#jsondata").text(stringify);

                        $("#jsonPre").html(parse2(stringify));
                    },
                    "click #download": function (e, value, row, index) {
                        let stringify = JSON.stringify(row, null, 2);
                        let blob = new Blob([stringify], { type: "application/json,charset=utf-8;" });
                        saveAs(blob, row.weathertype + "-" + row.forecasttime + ".json");
                    },
                },
            },
        ],
    });
}

function getSelections() {
    return $.map($table.bootstrapTable("getSelections"), function (row) {
        return row.id;
    });
}

function parse2(str) {
    str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return str.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            let cls = "number";
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = "key";
                } else {
                    cls = "string";
                }
            } else if (/true|false/.test(match)) {
                cls = "boolean";
            } else if (/null/.test(match)) {
                cls = "null";
            }
            return '<span class="' + cls + '">' + match + "</span>";
        },
    );
}

$().ready(function () {
    let token = window.localStorage.getItem("token");
    if(token) {
        let loginById = document.getElementById("login");
        loginById.innerHTML = "已登录";
    }
})

$(function () {
    $("#logout").click(function () {
        window.localStorage.removeItem("token");
        alert("已注销，若要使用查询功能，请重新登录");
        window.location.reload();
    })
})