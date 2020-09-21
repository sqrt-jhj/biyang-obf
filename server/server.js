const db = require('./config/db');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000; 

const InstaHandler = require('./instaHandler');

// const instaHandler = new InstaHandler();

var cron = require('node-cron');


/**
 * cronjob (매 1시간마다)
 * 인스타그램의 Media List 를 API 로 호출하여 DB 에 저장하는 Function 으로 Param을 넘겨준다.
 */
cron.schedule('0 0 */1 * * *', function (){
    console.log('크론테슽츠');
    instMediaSave();
    // load db media list
    // get api media list
    // compare db & api
    // if diffrent.szie() insert or update
})

/**
 * 
 * @param {인스타그램 API Nextpage} url 
 */
function instMediaSave(url){
    console.log ('param url : ', url);
    var instaApiUrl = 'https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp&access_token=IGQVJYeWVqZAGNvdG9tNzh4Rzd6SnJpZAi0tb21BTkNlUFZA2elBIcWozV1JOdElmN2VLX1hfS0pwYmNhZAVZAJM2JDbjhpaW83eGVfa1JFOHhsZAHU3TkpKOVc5TlFfeVhoSENoTW9rX3RsLWVrWmFCNkFyUQZDZD';
    if (url !== undefined) {
        instaApiUrl = url;
    }
    getInstaMedia(function (data, nextUrl) {
        // console.log('nextUrl : ', nextUrl);
        if (nextUrl !== undefined) {
            // console.log('next page is exist url : ', nextUrl);
            instMediaSave(nextUrl);
        } else {
            console.log('next page is not exist');
        }
        
    }, instaApiUrl);
    
    // console.log('save function is done.');
}

app.get('/api/host', (req, res) => {
    res.send({ host : 'biyangdo.net'});
})

/**
 * 홈페이지 RequestMapping URL
 */

/**
 * 메인페이지
 */
app.get('/main', (req, res) => {
    res.send({ main : 'main'});
})

/**
 * 비양도 둘러보기
 */
app.get('/look', (req, res) => {
    res.send({ look : 'look'});
})

/**
 * 영상
 */
app.get('/video', (req, res) => {
    res.send({ video : 'video'});
})

/**
 * 사진
 */
app.get('/photo', (req, res) => {
    res.send({ photo : 'photo '});
})

/**
 * 사진
 */
app.get('/script', (req, res) => {
    res.send({ script : 'script '});
})

/**
 * 이장입니다
 */
app.get('/foreman', (req, res) => {
    res.send({ foreman : 'foreman '});
})



/* INSTA AREA */

/**
 * call : every 1 hour from quartz
 * 인스타그램에서 가저온 데이터를 DB 저장한다.
 */
app.get('/api/media/insta/list', (req, res) => {
  
    res.send({ test : ''})
})

app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}/`);
})

function getInstaMedia(callback, url) {
    // console.log('url : ' , url);
    var request = require('request');
    var instaApiUrl = 'https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp&access_token=IGQVJYeWVqZAGNvdG9tNzh4Rzd6SnJpZAi0tb21BTkNlUFZA2elBIcWozV1JOdElmN2VLX1hfS0pwYmNhZAVZAJM2JDbjhpaW83eGVfa1JFOHhsZAHU3TkpKOVc5TlFfeVhoSENoTW9rX3RsLWVrWmFCNkFyUQZDZD';
    if (url !== undefined) {
        instaApiUrl = url;
    }
    request(instaApiUrl, function(error, response, body){
        if (!error && response.statusCode == 200) {
            let resJson = JSON.parse(body);
            
            for (var i=0; i<resJson.data.length;i++) {
                
                // check id exist then insert
                getMediaIdCnt(resJson.data[i], function(err, data) {
                    if (err) {
                        console.log("ERROR : ", err);
                    } else {
                        console.log("result from db is : ", data);
                        if (data === '1') {
                        }
                    }
                });
                
                // break;
               
            }
            resJson = JSON.parse(body);
            return callback(resJson, resJson.paging.next);
        } else {
            console.log('url is wrong....');
        }
    })
}

function getMediaIdCnt (mediaDatas, callback) {
    console.log('invoke getMediaIdCnt.....................');
    db.any("SELECT COUNT(media_id) FROM media_insta_list WHERE media_id = '"+[mediaDatas.id]+"'")
    .then (function (data) {
        console.log('data : ', data);
        if (data[0].count === '0') {
            console.log('INSERT....');
            var queryStr = "INSERT INTO media_insta_list (media_id, media_dt, media_url, media_type, media_permalink, media_caption) "+
            " VALUES ('"+mediaDatas.id+"', '"+mediaDatas.timestamp+"', '"+mediaDatas.media_url+"', '"+mediaDatas.media_type+"', '"+mediaDatas.permalink+"', '"+mediaDatas.caption+"') ";
            db.any(queryStr);
        } else {
            console.log('exist media id');
        }
        callback(null, data[0].count);
    })
    .catch (function (error) {
        console.log('error :', error);

        callback(error, null);
    });
}
