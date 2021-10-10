/*
Các chức năng cần thực hiện

 1. Render songs from
 2. Scroll top
 3. Play(chơi) / Pause(dừng) / Seek(tua) 
 4. CD rotate //quay đĩa CD khi chạy Songs và dừng khi pause songs
 5. Next Song / Prev Song
 6. Randoms 
 7. Next or Repeat when ended 
 8. Active songs ( khi phát bài nào thì bài đó active)
 9. Scroll active songs into view (tự đọng đưa bài hát đang play lên trên nếu nó khuất ở dưới)
10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player    = $('.player') 
const cd        = $('.cd')
const heading   = $('header h2')
const cdThumb   = $('.cd-thumb')
const audio     = $('#audio')
const playBtn   = $('.btn-toggle-play')
const progress  = $('#progress')
const prevBtn   = $('.btn-prev')
const nextBtn   = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist  = $('.playlist')

const app = {     
    currentIndex: 0, 
    isPlaying: false, 
    isRandom: false,
    isRepeat: false,
    arrOldIndexes: [],
    songs: [ 
        {
            name: 'Heaven',
            singer: 'Avicii ft. Chris Martin',
            path: './assets/music/Avicii ft. Chris Martin - Heaven.mp3',
            image: './assets/img/Avicii ft. Chris Martin - Heaven.jpg'
        },
        {
            name: '1901',
            singer: 'Birdy',
            path: './assets/music/Birdy - 1901.mp3',
            image: './assets/img/Birdy - 1901.jpg'
        },
        {
            name: 'Wings',
            singer: 'Birdy',
            path: './assets/music/Birdy - Wings.mp3',
            image: './assets/img/Birdy - Wings.jpg'
        },
        {
            name: 'Adventure of a Lifetime',
            singer: 'Coldplay',
            path: './assets/music/Coldplay - Adventure of a Lifetime.mp3',
            image: './assets/img/Coldplay - Adventure of a Lifetime.jpg'
        },
        {
            name: 'U.F.O.',
            singer: 'Coldplay',
            path: './assets/music/Coldplay - UFO.mp3',
            image: './assets/img/Coldplay - UFO.jpg'
        },
        {
            name: 'Afire Love',
            singer: 'Ed Sheeran',
            path: './assets/music/Ed Sheeran - Afire Love.mp3',
            image: './assets/img/Ed Sheeran - Afire Love.jpg'
        },
        {
            name: 'Robot Boy',
            singer: 'Linkin Park',
            path: './assets/music/Linkin Park – Robot Boy.mp3',
            image: './assets/img/Linkin Park – Robot Boy.jpg'
        },
        {
            name: 'A World Alone',
            singer: 'Lorde',
            path: './assets/music/Lorde - A World Alone.mp3',
            image: './assets/img/Lorde - A World Alone.jpg'
        },
        {
            name: 'Ribs',
            singer: 'Lorde',
            path: './assets/music/Lorde - Ribs.mp3',
            image: './assets/img/Lorde - Ribs.jpg'
        },
        {
            name: 'Gotta Be You',
            singer: 'One Direction',
            path: './assets/music/One Direction - Gotta Be You.mp3',
            image: './assets/img/One Direction - Gotta Be You.jpg'
        },
        {
            name: 'Sunflower',
            singer: 'Post Malone & Swae Lee',
            path: './assets/music/Post Malone & Swae Lee - Sunflower.mp3',
            image: './assets/img/Post Malone & Swae Lee - Sunflower.jpg'
        },
        {
            name: 'High Five',
            singer: 'Sigrid',
            path: './assets/music/Sigrid - High Five.mp3',
            image: './assets/img/Sigrid - High Five.jpg'
        },
    ], 

    //render ra view
    render: function() {
        const htmls = this.songs.map((song, index)=> {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        //$('.playlist').innerHTML = htmls.join('')
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        
        const cdWidth = cd.offsetWidth 

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'} 
        ], {
            duration: 10000, 
            iterations: Infinity 
        })
        cdThumbAnimate.pause() 

        // lắng nghe event phóng to thu nhỏ CD khi kéo lên xuống list

        // document.onscroll = function () {
            
        //     const scrollTop = window.scrollY || document.documentElement.scrollTop 
        //     const newCdWidth = cdWidth - scrollTop 

        //     cd.style.width=newCdWidth > 0 ? newCdWidth + 'px' :0;
        //     cd.style.opacity=newCdWidth / cdWidth //cd mờ dần khi ta kéo list lên
        // } 

        // xử lý khi click play

        playBtn.onclick=function() {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //Khi song được Play 
        audio.onplay = function () {
            app.isPlaying=true
            player.classList.add('playing')
            cdThumbAnimate.play() //khi Play bài hát thì CD bắt đầu quay
        }

        //Khi song bị Pause 
        audio.onpause = function () {
            app.isPlaying=false
            player.classList.remove('playing')
            cdThumbAnimate.pause() //khi Pause bài hát thì CD ngừng quay
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100) // floor làm tròn dưới
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua Songs
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value 
            audio.currentTime = seekTime
        }
        // Xử lý khi bấm pre songs
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lý khi bấm next songs
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render() 
            app.scrollToActiveSong()
        }
        
        // xử lý bật / tắt Random
        randomBtn.onclick = function(e) {
            app.isRandom = !app.isRandom 
            randomBtn.classList.toggle('active', app.isRandom) 
        }

        // Xử lý next song khi audio anded, next song hoặc repeat

        audio.onended = function() {
            if(app.isRepeat) { // khi repeat
                audio.play()
            } else { // không repeat thì next song
                nextBtn.click() 
            }
        }

            // 2. Xử lý khi bấm repeat
        repeatBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat 
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        //  Lắng nghe hành vi click vào playlist 
        playlist.onclick = function(e) {
            
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) { 
                
                //xử lý click vào song 
                if (e.target.closest('.song:not(.active)')) {
                    app.currentIndex = Number(songNode.dataset.index) 
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }

                //xử lý click vào song option
                if (e.target.closest('.option')) {

                }

            } 
        }
    },

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex ++ 
        if (this.currentIndex >= this.songs.length) { 
            this.currentIndex = 0 
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex -- 
        if (this.currentIndex < 0) { //nếu thứ tự bài nhỏ hơn 0
            this.currentIndex = this.songs.length - 1 // thì quay về bài cuối
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex

        this.arrOldIndexes.push(this.currentIndex)
        if (this.arrOldIndexes.length === this.songs.length) {
            this.arrOldIndexes = [];
        }

        do {
            newIndex = Math.floor(Math.random() * this.songs.length) 
        }
        while (this.arrOldIndexes.includes(newIndex)) 

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong: function() {
        setTimeout(()=>{
            $('.song.active').scrollIntoView({ 
                behavior: 'smooth',
                block: 'end',
            }); 
        },300)
    },
    

    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties() 

        // Lắng nghe xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()
    },
}

app.start()