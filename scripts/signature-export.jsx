﻿#target illustrator // MU Signature exports// Source document parameters// // * CMYK mode// * Gold is the CMYK build as a swatch named "C=0 M=25 Y=90 K=5" // * Black is a grey color swatch set to 100%// * Document has artboards for horizontal and vertical versions of signatures// To make sure there is at least one document available in Illustrator// and atleast one object in that document to work uponif ( app.documents.length > 0 && app.activeDocument.pathItems.length > 0) {      var docRef          = app.activeDocument;     var docName         = docRef.name.substr(0, docRef.name.lastIndexOf('.'))    var numExported     = 0;    var numArtboards    = docRef.artboards.length;         // Select Text    app.executeMenuCommand ('Text Objects menu item');    // Convert text to outline    app.executeMenuCommand ('outline');            // Choose an export folder destination    var FolderRef = new Folder();      var folderResult = false;      try {          FolderRef = FolderRef.selectDlg("Choose the export destination folder");          if (FolderRef != null) {              folderResult = true;          }      } catch (e) {          alert("! Error on selecting folder:\n"+e+" !");          folderResult = false;      }                      // Print versions -----------------------    media = "print";    mediaFolder = new Folder(FolderRef + "/" + media);	if (!mediaFolder.exists) {		mediaFolder.create();	}    // 4c ----------    docColor = "4c";        // Black text    textColor = 100;    textColorName = "black";    epsExport();        // White text    textColor = 0;    colorText();    epsExport();            // 2c Coated ----------    docColor = "2c-coated";    logoCoated();        // Black text    textColor = 100;    colorText();    epsExport();        // White text    textColor = 0;    colorText();    epsExport();            // 2c Uncoated ----------    docColor = "2c-uncoated";    logoUnCoated();        // Black text    textColor = 100;    colorText();    epsExport();        // White text    textColor = 0;    colorText();    epsExport();            // 1c ----------    docColor = "1c";    logoWhite();        // Black text    textColor = 100;    colorText();    epsExport();        // White text    textColor = 0;    colorText();    epsExport();              // Screen versions ------------------------     media = "screen";        mediaFolder = new Folder(FolderRef + "/" + media);	if (!mediaFolder.exists) {		mediaFolder.create();	}        // Change colorspace to RGB    app.executeMenuCommand ('doc-color-rgb');     logoRgb(); // Convert 1c (white) to RGB gold        // Black text    textColor = 100;     colorText();     pngExport();     epsExport();         //white text    textColor = 0;    colorText();    pngExport();     epsExport();                     // Closes the active document without saving changes    if ( app.documents.length > 0 ) {        aiDocument = app.activeDocument;        aiDocument.close( SaveOptions.DONOTSAVECHANGES );        aiDocument = null;    }        alert("Done!");      }  else {    alert("No documents open to process.");}// Color the text either black or white// Text must be compound paths!function colorText() {        if (textColor == 100) {        textColorName = "black";    }    if (textColor == 0) {        textColorName = "white";    }    var totalCompoundPaths = docRef.compoundPathItems.length;               for  (var i = 0; i < totalCompoundPaths; i++ ) {              var totalPaths = docRef.compoundPathItems[i].pathItems.length;                         for (var j = 0; j < totalPaths; j++ ) {            var newGrayColor = new GrayColor();                newGrayColor.gray = textColor;                        docRef.compoundPathItems[i].pathItems[j].fillColor = newGrayColor;                    }    } }   // Gold conversion -- MUST HAPPEN IN ORDERfunction logoCoated() {        var totalItems = docRef.pathItems.length;    for  (var i = 0; i < totalItems; i++ ) {                if (docRef.pathItems[i].fillColor.spot) {                    if (docRef.pathItems[i].fillColor.spot.name == "C=0 M=25 Y=90 K=5") {                // Define the new color                var newSpot = docRef.pathItems[i].fillColor.spot                newSpot.name = "PANTONE 124 C";                newSpot.colorType = ColorModel.SPOT;            }        }     }}function logoUnCoated() {        var totalItems = docRef.pathItems.length;    for  (var i = 0; i < totalItems; i++ ) {                if (docRef.pathItems[i].fillColor.spot) {                    if (docRef.pathItems[i].fillColor.spot.name == "PANTONE 124 C") {                // Define the new color                var newSpot = docRef.pathItems[i].fillColor.spot                newSpot.name = "PANTONE 7406 U";                }        }     }}function logoWhite() {        var totalItems = docRef.pathItems.length;    for  (var i = 0; i < totalItems; i++ ) {                if (docRef.pathItems[i].fillColor.spot) {                    if (docRef.pathItems[i].fillColor.spot.name == "PANTONE 7406 U") {                // Define the new color                //var newColor = docRef.pathItems[i].fillColor.spot                //newColor.name = "C=0 M=0 Y=0 K=0";                //newColor.colorType = ColorModel.PROCESS;                                var newGrayColor = new GrayColor();                        newGrayColor.gray      = 0;                           docRef.pathItems[i].fillColor = newGrayColor;                }        }     }    // Remove all spot colors    var spotCount = docRef.spots.length;    if (spotCount > 0) {        app.activeDocument.spots.removeAll();    }    }function logoRgb() {        docColor            = "rgb";    var totalItems      = docRef.pathItems.length;    for  (var i = 0; i < totalItems; i++ ) {                    if (docRef.pathItems[i].fillColor.gray == 0) {                        // Define the new color            var newRGBColor = new RGBColor();                newRGBColor.red     = 241;                newRGBColor.green   = 184;                newRGBColor.blue    = 45;                 docRef.pathItems[i].fillColor = newRGBColor;        }     }}// Export EPS function epsExport() {            var destFile = new File( FolderRef + "/" + media + "/" + docName + "_" + docColor + "_" + textColorName);            var options = new EPSSaveOptions();        options.saveMultipleArtboards = true;        options.artboardRange = "1 - " + numArtboards;                    docRef.saveAs ( destFile, options );  }// Export TIFF function tiffExport() {    var destFile = new File( FolderRef + "/" + media + "/" + docName + "_" + docColor + "_" + textColorName);            var options = new ExportOptionsTIFF();        //options.saveMultipleArtboards   = true;        //options.artboardRange           = "1 - " + numArtboards;        //options.imageColorSpace         = ImageColorSpace.CMYK;        //exportOptions.byteOrder         = TIFFByteOrder.IBMPC;        //options.resolution              = 300.0;        //options.IZWCompression          = true;                    docRef.exportFile( destFile, ExportType.TIFF, options );  }// Export PNGfunction pngExport() {        docColor = "rgb"; // PNG only has rgb output        for (var i = 0; i < numArtboards; i++ ) {        var artboardName = docRef.artboards[i].name;                   var destFile = new File( FolderRef + "/" + media + "/" + docName + "_" + docColor + "_" + textColorName + "_" + artboardName);                var options = new ExportOptionsPNG24();            options.artBoardClipping    = true;            options.horizontalScale     = 400;            options.verticalScale       = 400;                docRef.artboards.setActiveArtboardIndex(i);            docRef.exportFile (destFile, ExportType.PNG24, options);          numExported++;    }}