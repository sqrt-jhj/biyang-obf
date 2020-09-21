const PgPromise = require("pg-promise")();

class InstaModel {
    constructor() {
        this.db = PgPromise("postgres://postgres:1whrkwmdkSqRt5!@localhost:5432/postgres");
    }

    /**
     * DB에 있는 인스타그램 Media list 목록을 불러온다.
     */
    getMediaIdCnt(media_id){
        return this.db.any('SELECT COUNT(media_id) FROM media_insta_list WHERE media_id=$1', [media_id]);
    }

    /**
     * 인스타그램 미디어를 INSERT 한다.
     * @param {*} media_id 
     * @param {*} media_dt 
     * @param {*} media_url 
     * @param {*} media_type 
     * @param {*} media_permalink 
     * @param {*} media_caption 
     */
    putMedia(media_id, media_dt, media_url, media_type, media_permalink, media_caption){              
        return this.db.any("INSERT INTO media_insta_list (media_id, media_dt, media_url, media_type, media_permalink, media_caption) VALUES ($1, $2, $3, $4, $5, $6) ", [media_id, media_dt, media_url, media_type, media_permalink, media_caption]);
    }
}

module.exports = InstaModel;