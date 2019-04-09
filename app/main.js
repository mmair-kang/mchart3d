$(function() {

    var chart = {
        result  : [],
        list    : [],

        result_index: 0,
        rank_min_num: 0,

        data    : {
            updateSpeed : 0.02,
            checkSpeed  : 100,
            max_width   : 30,
            max         : 30
        },
        bar : {
            y_size      : 4,
            y_gap       : 6,
            min_scale   : 12,
            fx          : 3,
            fx_val      : -97,
            fx_image    : 4
        }
    };

    var colorpicker = [
        { color: 0xff1100 },
        { color: 0xff3300 },
        { color: 0xff6600 },
        { color: 0xff9900 },
        { color: 0xffcc00 },
        { color: 0xffff00 },
        { color: 0xccff00 },
        { color: 0x99ff00 },
        { color: 0x66ff00 },
        { color: 0x33ff00 },
        { color: 0x00ff00 },
        { color: 0x00ff33 },
        { color: 0x00ff66 },
        { color: 0x00ff99 },
        { color: 0x00ffcc },
        { color: 0x00ffff },
        { color: 0x00ccff },
        { color: 0x0099ff },
        { color: 0x0066ff },
        { color: 0x0033ff },
        { color: 0x0000ff },
        { color: 0x0000ff },
        { color: 0x3300ff },
        { color: 0x6600ff },
        { color: 0x9900ff },
        { color: 0xcc00ff },
        { color: 0xff00ff },
        { color: 0xff0000 },
        { color: 0xff3300 },
        { color: 0xff6600 },
        { color: 0xff9900 },
        { color: 0xffcc00 },
        { color: 0xffff00 },
        { color: 0xccff00 },
        { color: 0x99ff00 },
        { color: 0x66ff00 },
        { color: 0x33ff00 },
        { color: 0x00ff00 },
        { color: 0x00ff33 },
        { color: 0x00ff66 },
        { color: 0x00ff99 },
        { color: 0x00ffcc },
        { color: 0x00ffff },
        { color: 0x00ccff },
        { color: 0x0099ff },
        { color: 0x0066ff },
        { color: 0x0033ff },
        { color: 0x0000ff },
        { color: 0x0000ff },
        { color: 0x3300ff },
        { color: 0x6600ff },
        { color: 0x9900ff },
        { color: 0xcc00ff },
        { color: 0xff00ff },


    ]




  // Values
  var tick = 0;
  var size = 0.25;

    // Arrays
    var item = {
        bar: [],
        bar_rank: [],
        bar_rank_text: [],
        bar_val: [],
        bar_val_text: [],
        bar_image: []
    };

  ///////////////////////
  // Initial Setup     //
  ///////////////////////

    init();
    function init() {
        initListeners();
        init3DScene();
        initControl();

        initData();
    }

    function initListeners() {
        $(window).resize(onWindowResize);
    }

    function initControl() {

    }

    function initData() {

        var complete = function(t) {
            ////Temp
            t = [];
            for ( var i=0; i<5; ++i ) {
                var obj = {};
                obj.Date = String(1980 + i) +'년';
                for ( var j=0; j<20; ++j ) {
                    if ( i == 0 ) {
                        obj["테스트"+j] = 531110;
                    }
                    else {
                        obj["테스트"+j] = 5000 * Util.randomInt(1,100);
                    }

                }
                t.push(obj);
            }

            chart.result = t;
            chart.list = [];
            //단위바꾸기
            if ( t.length > 0 ) {

                //천단위를 만단위로
                for ( var s in t ) {
                    for ( var s2 in t[s] ) {
                        if ( s2 == "Date") continue;
                        if ( Number(t[s][s2]) ) {
                            t[s][s2] = Number(t[s][s2])
                        }
                    }
                }

                var colorIndex = 0;
                for ( var s in t[0] ) {
                    if ( s == "Date" ) continue;
                    var listObj = {};
                    // var colorIndex = 0;
                    // listObj.color = 'linear-gradient( to bottom, rgba(' + this.state.colorpicker[colorIndex].color + ',1),';
                    // listObj.color += 'rgba(' + this.state.colorpicker[colorIndex].color + ',0.5)';
                    listObj.name = s;
                    listObj.n_check = Number(t[0][s]);
                    chart.list.push(listObj);
                }
            }

            onChart("start");
        };

        // var sheet = '117RNobktAAa7bI3nlkelV0F_Jjq6gXCZdSMp5RYQfAM';
        // var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/' + sheet + '/edit';
        // Tabletop.init({
        //     key: '117RNobktAAa7bI3nlkelV0F_Jjq6gXCZdSMp5RYQfAM',
        //     callback: complete,
        //     simpleSheet: true
        // });

        complete({});
    }

    function onChart(v, t) {
        switch(v) {
            case "start":
                for ( var i=0; i<chart.list.length; ++i ) {
                    var fi = chart.list[i];
                    createItem(i);
                    chart.list[i].rank = 20;
                }
                onChart("checkPoint");
                break;

            case "checkPoint":
                console.log('[checkPoint] result_index : ' + chart.result_index);

                if ( chart.result.length == chart.result_index ) {
                    //종료
                    return;
                }

                for ( var i=0; i<chart.list.length; ++i ) {
                    var fi = chart.list[i];
                    var newData = Number(chart.result[chart.result_index][fi.name]);
                    if ( !newData ) newData = 0;

                    // if( chart.rank_min_num > 0 ) {
                    if ( newData == 0 ) {
                        // chart.result[chart.result_index][fi.name] = chart.rank_min_num - 10;
                        newData = chart.result[chart.result_index][fi.name];
                    }
                    else {
                        onChart("moveBar", { num:newData, index: i });
                    }
                    // }
                    chart.list[i].n_check = newData;
                }


                var point = 0;
                var pointMax = chart.data.checkSpeed;
                for ( var i=0; i<pointMax; ++i ) {
                    var pointPlus = 1/pointMax;
                    point += pointPlus;

                    ///Temp

                    if ( i == pointMax-1 ) {
                        chart.result_index++;
                        console.log('result_index : ' + chart.result_index)
                        TweenMax.delayedCall(i*chart.data.updateSpeed, function(index){
                            onChart("checkPoint")
                        });
                    }
                }


                break;

            case "moveBar":
                // onChart("moveChart", { num:newData, index: i });

                var moveData = (t.num/5000) + 12;

                var moveSpeed = chart.data.updateSpeed * chart.data.checkSpeed;

                var moveType = "stop";
                if ( item.bar[t.index].scale.x < moveData ) {
                    moveType = "plus";
                }
                else if ( item.bar[t.index].scale.x > moveData ) {
                    moveType = "minus";
                }

                TweenMax.to(item.bar[t.index].scale,   moveSpeed, { x: chart.bar.min_scale + moveData, ease:Linear.easeNone, onUpdate:function(tm){
                    chart.list[tm.index].value = item.bar[tm.index].scale.x;
                    onChart("update", { index: tm.index, currData: chart.list[tm.index].value, toData: tm.toData, type:tm.type });

                }, onUpdateParams:[{index:t.index, toData:moveData, type:moveType }] });

                TweenMax.to(item.bar[t.index].position, moveSpeed, { x: chart.bar.fx + (moveData/2), ease:Linear.easeNone });
                TweenMax.to(item.bar_val[t.index].position, moveSpeed, { x: chart.bar.fx_val + (moveData), ease:Linear.easeNone });
                TweenMax.to(item.bar_image[t.index].position, moveSpeed, { x: chart.bar.fx_image + (moveData), ease:Linear.easeNone });

                break;

            case "update":

                var valueArray = [];
                for ( var i=0; i<chart.list.length; ++i ) {
                    var fi = chart.list[i];
                    var value = fi.value ? fi.value : 0;
                    valueArray.push(value);
                }
                var rankArray = Util.rankArray( valueArray );
                var rankIndex = rankArray[t.index];


                if ( rankArray[t.index] !== chart.list[t.index].rank ) {
                    TweenMax.to(item.bar[t.index].position, 0.6, { y:120 - (rankIndex * chart.bar.y_gap) });
                    TweenMax.to(item.bar_val[t.index].position, 0.6, { y:126 - (rankIndex * chart.bar.y_gap) });
                    TweenMax.to(item.bar_image[t.index].position, 0.6,{ y:121 - (rankIndex*5.92) });

                    var fontSize = 25 - (rankIndex*0.7);
                    $("#val_text"+t.index).css({
                        fontSize: fontSize + 'pt'
                    })






                    // TweenMax.to(item.bar[i].position, 0.6, { x: chart.bar.fx + (chart.bar.min_scale/2), y:120 - (rx*chart.bar.y_gap) });
                    //
                    //



                    chart.list[t.index].rank = rankIndex;
                }


                var valStr = "";

                var currData = chart.list[t.index].n_check * ( t.currData / t.toData )
                currData = parseInt(currData);

                valStr += chart.list[t.index].name + " ";

                if ( t.type == "plus" ) {
                    valStr += '<font color="#ff6600">'+currData+' ↑</font>';
                }
                else if ( t.type == "minus" ) {
                    valStr += '<font color="#0066ff">'+currData+' ↑</font>';
                }
                else {
                    valStr += '<font color="#999999">'+currData+'</font>';
                }

                $("#val_text"+ t.index).html( valStr );



                return;
                var per = t;
                var chartArray = [];

                if ( chart.result_index > 0 ) {
                    for ( var i=0; i<chart.list.length; ++i ) {
                        var fi = chart.list[i];
                        let newData = Number(chart.result[chart.result_index][fi.name]);
                        let prevData = Number(chart.result[chart.result_index-1][fi.name]);
                        let plusData = newData - prevData;
                        let plusDataPer = (plusData * per);

                        if ( i == 0 ){
                            // console.log(per + ' : ' + prevData + ' : ' + newData);
                        }

                        let toData = (prevData + plusDataPer).toFixed(0);

                        if ( i == 0 ) {
                            // console.log(chart.list[i].name + ' : ' + toData);
                        }


                        chart.list[i].n = Number(toData);
                        chart.list[i].plus = plusData > 0;
                        chartArray.push(toData);

                    }
                }

                var rankArray = Util.rankArray( chartArray );
                var listLength = 0;

                // console.log(rankArray);

                for ( var i=0; i<rankArray.length; ++i ) {
                    var rx = parseInt(rankArray[i]);
                    // if ( rx > 0 ) {
                        if ( rx !== chart.list[i].rank ) {

                                // TweenMax.to(item.bar[i].position, 0.6, { x: chart.bar.fx + (chart.bar.min_scale/2), y:120 - (rx*chart.bar.y_gap) });
                                // TweenMax.to(item.bar_image[i].position, 0.6,{ x: chart.bar.fx_image + (chart.bar.min_scale/2), y:121 - (rx*5.92) });
                                //





                        }
                        chart.list[i].rank = rx;
                        if ( chart.list[i].rank === 1 ) {
                            // if ( !this.state.bgline.stat.fix ) { // bgline FIX 모드가 아닌경우
                                if ( Number(chart.list[i].n > 0 ) ) {
                                    chart.data.max = Number(chart.list[i].n );
                                }
                            // }
                        }

                        if ( Number( chart.list[i].n ) == 0 || chart.list[i].rank >= 20 ) {
                            if ( !chart.list[i].hidden ) {
                                chart.list[i].hidden = true;
                            }
                        }
                        else {
                            if ( chart.list[i].hidden ) {
                                chart.list[i].hidden = false;
                            }
                        }

                        if ( chart.list[i].hidden ) {
                            listLength++;
                        }
                    // }
                }

                if ( listLength < chart.list.length ) {
                    var hiddenLength = chart.list.length - listLength;
                    for ( var i=hiddenLength; i<chart.list.length; ++i ) {
                        // if( $("#panel_rank"+(i+1)).css('opacity') !== 0 ) {
                            // $("#panel_rank"+(i+1)).css({ opacity: 0 });
                        // }
                    }
                }

                for ( var i=0; i<chart.list.length; ++i ) {


                    var value = chart.data.max * (  chart.list[i].n / chart.data.max );
                    chart.list[i].w = value / ( chart.data.max / chart.data.max_width );

                    if ( !chart.list[i].hidden ) {
                        // TweenMax.to($("#item"+i), 1, { opacity: 1});
                    }
                    else {
                        // TweenMax.to($("#item"+i), 1, { opacity: 0});
                    }
                };



                var maxRank = 20;

                for ( var i=0; i<chart.list.length; ++i ) {
                    var fi = chart.list[i];

                    // console.log(fi.rank + ' : ' + maxRank);
                    if ( fi.rank == maxRank-1 ) {
                        chart.rank_min_num = Number(chart.list[i].n);
                    }

                    var ri = chart.list[i].w;
                    // TweenMax.set(item.bar[i].scale, { x:ri } );
                    // TweenMax.set(item.bar[i].position, { x: 5 + (ri/2) });
                }


                break;
        }



    };

    function createItem(i) {
        var barGeometry = new THREE.BoxGeometry(1, 1, 1);
        barGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));
        var barMaterial = new THREE.MeshPhongMaterial({
            color   : colorpicker[i].color,
        });
        var barMesh = new THREE.Mesh(barGeometry, barMaterial);
        barMesh.name = "bar-" + i;
        barMesh.castShadow = true;
        barMesh.receiveShadow = true;


        var mapImage = THREE.ImageUtils.loadTexture( '/app/assets/image/country/png/Korea.png' );
        var barImageMaterial = new THREE.MeshPhongMaterial({
            map: mapImage
        });
        var barImage = new THREE.Mesh(barGeometry, barImageMaterial);
        barImage.name = "bar-image-" + i;
        barImage.castShadow = true;
        barImage.receiveShadow = true;

        scene.add(barMesh);
        scene.add(barImage);

        item.bar.push(barMesh);
        item.bar_image.push(barImage);

        TweenMax.set(item.bar[i].scale, { x: chart.bar.min_scale, y: chart.bar.y_size, z:1 });
        TweenMax.set(item.bar[i].position, { x: chart.bar.fx + (chart.bar.min_scale/2), z:0 , y:120 - (i*chart.bar.y_gap) });

        TweenMax.set(item.bar_image[i].scale, { x: 10, y: chart.bar.y_size*0.8, z:0.3 });
        TweenMax.set(item.bar_image[i].position, { x: chart.bar.fx_image + (chart.bar.min_scale/2), z:1.4 , y:121 - (i*5.92) });

        // world
        var rankGeometry = new THREE.BoxGeometry(1,1,1);
        var rankMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        var rank_mesh = new THREE.Mesh(rankGeometry, rankMaterial);
        rank_mesh.updateMatrix();
        rank_mesh.matrixAutoUpdate = false;
        rank_mesh.position.x = 0;
        rank_mesh.position.y = 126 - (i*chart.bar.y_gap);
        rank_mesh.position.z=  0;
        var rank_text = createTextLabel("rank_text", i);
        rank_text.setHTML( ( i+1) );
        rank_text.setParent(rank_mesh);
        scene.add(rank_mesh);
        item.bar_rank.push(rank_mesh);
        item.bar_rank_text.push(rank_text);

        $("#tdContainer").append(rank_text.element);

        var fontSize = 20 - (i*0.4);



        $("#rank_text"+i).css({
            fontSize    : fontSize + 'pt',
            textAlign   : 'center',
            width       : '30px'
        })


        // 
        // var textMesh	   = new THREEx.Text('THREEx', {
        // 	font		: "droid serif",
        // 	weight		: "bold",
        // 	size		: 1,
        // 	height		: 0.4,
        // })
        // scene.add(textMesh)
        //









        // world
        var valGeometry = new THREE.BoxGeometry(1,1,1);
        var valMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        var val_mesh = new THREE.Mesh(valGeometry, valMaterial);
        val_mesh.updateMatrix();
        val_mesh.matrixAutoUpdate = false;

        val_mesh.position.x = chart.bar.fx_val + (chart.bar.min_scale/2);
        val_mesh.position.y = 125 - (i*chart.bar.y_gap);
        val_mesh.position.z = 0;
        var val_text = createTextLabel("val_text", i);
        // val_text.setHTML(chart.list[i].name);
        val_text.setParent(val_mesh);
        scene.add(val_mesh);
        item.bar_val.push(val_mesh);
        item.bar_val_text.push(val_text);
        $("#tdContainer").append(val_text.element);

        var fontSize = 25 - (i*0.7);
        $("#val_text"+i).css({
            fontSize: fontSize + 'pt'
        })
        $("#val_text"+ i).html( "테스트" );








    }


    function createTextLabel(id, i) {
        var div = document.createElement('div');
        div.id = id + i;
        div.style.position = 'absolute';
        div.style.width = 100;
        div.style.height = 100;
        div.innerHTML = "";
        div.style.top = -1000;
        div.style.left = -1000;

        var _this = this;

        return {
            element: div,
            parent: false,
            position: new THREE.Vector3(0,0,0),
            setHTML: function(html) {
                this.element.innerHTML = html;
            },
            setParent: function(threejsobj) {
                this.parent = threejsobj;
            },
            updatePosition: function() {
                if(parent) {
                    this.position.copy(this.parent.position);
                }

                var coords2d = this.get2DCoords(this.position, _this.camera);
                this.element.style.left = coords2d.x + 'px';
                this.element.style.top = coords2d.y + 'px';
            },
            get2DCoords: function(position, camera) {
                var vector = position.project(camera);
                vector.x = (vector.x + 1)/2 * window.innerWidth;
                vector.y = -(vector.y - 1)/2 * window.innerHeight;
                return vector;
            }
        }
    }




    function init3DScene() {

        // Setup Scene / Camera
        scene = new THREE.Scene();

        // new THREE.OrthographicCamera ( LEFT, RIGHT, TOP, BOTTOM, NEAR, FAR);
        // camera = new THREE.OrthographicCamera( 22, 70, 100, 30, - 500, 1000);
        // camera.aspect = 1.24;
        // camera.position.set(0, 80, 200);
        // camera.zoom = 0.5;
        // camera.fov = 90;

        // PerspectiveCamera( 거리
        camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.aspect = 2.24;
        camera.zoom = 0.8;
        camera.fov = 45;

        camera.up.set(0,0,0);


        // camera.lookAt (new THREE.Vector3 (-1.44, 110.0, 101.0));

        camera.position.x = 0;
        camera.position.y = 130;
        camera.position.z = 110;




        var lookDirection = new THREE.Vector3();
        console.log(lookDirection);
        lookDirection.y = 100;
        camera.getWorldDirection(lookDirection);
        camera.updateProjectionMatrix();

        scene.position.x = -110;

        // Setup Renderer
        renderer = new THREE.WebGLRenderer({
          antialias: true
        });

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);

        $("#tdContainer").append(renderer.domElement);
        init3DElements();

        // Control
        var controls = new THREE.OrbitControls( camera, renderer.domElement );
        controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.screenSpacePanning = false;
		controls.minDistance = 100;
		controls.maxDistance = 500;
		controls.maxPolarAngle = Math.PI / 5;

        console.log(controls)

        controls.update();





    }

  function init3DElements() {
    createFloor();
    // createGrid();

    // createBar(5, -25, red);
    createLight();
  }


    function createGrid(opts) {
        // opts
        // {
        //  height: width,
        //  width: depth,
        //  linesHeight: b,
        //  linesWidth: c,
        //  color: 0xcccccc
        // }
        var config = opts || {
           height: 500,
           width: 500,
           linesHeight: 10,
           linesWidth: 10,
           color: 0xDD006C
         };

         var material = new THREE.LineBasicMaterial({
           color: config.color,
           opacity: 0.2
         });

         var gridObject = new THREE.Object3D(),
           gridGeo = new THREE.Geometry(),
           stepw = 2 * config.width / config.linesWidth,
           steph = 2 * config.height / config.linesHeight;

         //width
         for (var i = -config.width; i <= config.width; i += stepw) {
           gridGeo.vertices.push(new THREE.Vector3(-config.height, i, 0));
           gridGeo.vertices.push(new THREE.Vector3(config.height, i, 0));

         }
         //height
         for (var i = -config.height; i <= config.height; i += steph) {
           gridGeo.vertices.push(new THREE.Vector3(i, -config.width, 0));
           gridGeo.vertices.push(new THREE.Vector3(i, config.width, 0));
         }

         var line = new THREE.Line(gridGeo, material, THREE.LinePieces);
         gridObject.add(line);

         // return gridObject;
         scene.add(gridObject);
    }



  ///////////////////////
  // Interactions      //
  ///////////////////////

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

  ///////////////////////
  // Create Elements   //
  ///////////////////////

  function createLight() {

    var ambient = new THREE.AmbientLight(0x999999);
    var spot = new THREE.SpotLight({
      color: 0xffffff,
      intensity: 0.1
    });

    spot.position.set(-50, 100, 100);
    spot.castShadow = true;
    spot.shadowDarkness = 0.2;

    scene.add(ambient, spot);
  }





  function createFloor() {
    var geometry = new THREE.BoxGeometry(2000, 2000, 2000);
    var material = new THREE.MeshPhongMaterial({
      color: 0x2e2e2e,
      shininess: 20
    });
    material.side = THREE.BackSide

    floor = new THREE.Mesh(geometry, material);

    floor.position.set(110, 900, 40);
    floor.rotation.x = THREE.Math.degToRad(-90);

    floor.receiveShadow = true;
    scene.add(floor);
  }

  ///////////////////////
  // Render            //
  ///////////////////////

    function render() {
        tick++;
        for ( var i=0; i<item.bar_rank_text.length; ++i ) {
            item.bar_rank_text[i].updatePosition();
        }
        for ( var i=0; i<item.bar_val_text.length; ++i ) {
            item.bar_val_text[i].updatePosition();
        }

        // console.log(camera);

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    render();

});
