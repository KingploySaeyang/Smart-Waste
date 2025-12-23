/**
 * =========================================================
 * Firebase Base Configuration (Global)
 * File: public/db_config.js
 * Firebase SDK: v8.x
 * ใช้ร่วมกันทุกหน้า (Admin / User)
 * =========================================================
 */

(function (window) {
    'use strict';

    // ถ้ามีอยู่แล้ว ไม่ต้อง init ซ้ำ
    if (window.SWFirebase) {
        return;
    }

    // -----------------------------------------------------
    // Firebase Project Configuration
    // -----------------------------------------------------
    var firebaseConfig = {
        apiKey: "AIzaSyCyTSsRmX642krpJYOI-TfFpIhnxJBbzxk",
        authDomain: "smart-waste2568.firebaseapp.com",
        projectId: "smart-waste2568",
        storageBucket: "smart-waste2568.firebasestorage.app",
        messagingSenderId: "122699752010",
        appId: "1:122699752010:web:c22ab9b28ac15beaedbcb3",
        measurementId: "G-H82914YP66",
        databaseURL: "https://smart-waste2568-default-rtdb.asia-southeast1.firebasedatabase.app"
    };

    // -----------------------------------------------------
    // Initialize Firebase (ครั้งเดียวเท่านั้น)
    // -----------------------------------------------------
    if (!firebase.apps || !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // -----------------------------------------------------
    // Create Shared Firebase Services
    // -----------------------------------------------------
    var app = firebase.app();

    var firestore = firebase.firestore();
    var database = firebase.database();
    var auth = firebase.auth ? firebase.auth() : null;

    // ตั้งค่า Firestore เพิ่มเติม (ถ้าต้องการ)
    // firestore.settings({ ignoreUndefinedProperties: true });

    // -----------------------------------------------------
    // Expose Global Object
    // -----------------------------------------------------
    window.SWFirebase = {
        app: app,
        firestore: firestore,
        database: database,
        auth: auth,
        FieldValue: firebase.firestore.FieldValue
    };

})(window);
