const InstaModel = require("./instaModel")

class InstaHandler {

    constructor() {
        this.model = new InstaModel();
    }

    getMediaIdCnt(mediaData) {
        this.model.getMediaIdCnt(mediaData.media_id)
            .then(function(data){
                if(data[0].count === '1') {
                    // console.log('pass');
                } else {
                    this.putMedia(mediaData.media_id, mediaData.media_dt, mediaData.media_url, mediaData.media_type, mediaData.media_permalink, mediaData.media_caption);
                }

            })
            .catch(function(error) {
                console.log(error);
            });
    }
 
    putMedia(media_id, media_dt, media_url, media_type, media_permalink, media_caption) {
        this.model.putMedia(media_id, media_dt, media_url, media_type, media_permalink, media_caption);
    }
}

module.exports = InstaHandler;