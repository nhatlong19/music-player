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

const player    = $('.player') //lấy nút play
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

const app = {     //tạo 1 object có propety là songs
    currentIndex: 0, //lấy ra chỉ mục đầu tiên của mảng, từ đây lấy đc bài hát đầu tiên của mảng
    isPlaying: false, //
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
        
        const cdWidth = cd.offsetWidth //lấy ra chiều ngang mặc định của cd

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'} // quay 360 độ
        ], {
            duration: 10000, //quay 1 vòng mất 10s
            iterations: Infinity //lặp lại vô hạn
        })
        cdThumbAnimate.pause() // khi vừa mở lên nó sẽ ko quay, xử lý quay/ ngừng quay ở onplay, onpause

        // lắng nghe event phóng to thu nhỏ CD khi kéo lên xuống list
        document.onscroll = function () {
            //console.log(window.scrollY) //Y là chiều dọc của màn hình
            //console.log(document.documentElement.scrollTop) // tương tự cái trên
            const scrollTop = window.scrollY || document.documentElement.scrollTop //nếu trình duyệt ko window.scrollY thì dùng document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop //chiều ngang mới sẽ bằng ngang mặc định - tọa độ ta kéo thả
                                                   //mục đích để khi ta kéo danh sách bài hát đến đâu thì cd sẽ thu nhỏ dần theo đó
            //console.log(newCdWidth)

            //cd.style.width=newCdWidth + 'px'; //trong trường hợp ta kéo quá nhanh thì width sẽ bị gtri âm, dẫn đến cd ko thể mất hoàn toàn, muốn mất hoàn toàn thì width phải về 0
            cd.style.width=newCdWidth > 0 ? newCdWidth + 'px' :0;
            cd.style.opacity=newCdWidth / cdWidth //cd mờ dần khi ta kéo list lên
        } 

        // xử lý khi click play

        // Cách cùi
        // playBtn.onclick=function() {
        //     if (app.isPlaying) {
        //         app.isPlaying=false; //ở đây không dùng this. đc vì this sẽ trỏ vào playBtn chứ ko trỏ vào app
        //         audio.pause()
        //         player.classList.remove('playing')
        //     } else {
        //         app.isPlaying=true; //ở đây không dùng this. đc vì this sẽ trỏ vào playBtn chứ ko trỏ vào app
        //         audio.play()
        //         player.classList.add('playing')
        //     }
        // } // cách này cũng được nhưng code hơi xấu

        //Cách VIP
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
                //console.log(audio.currentTime / audio.duration * 100) //thời gian hiện tại chia cho tổng thời lượng bài hát nhân 100
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100) // làm tròn dưới
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua Songs
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value //lấy tổng số giây songs chia 100 rồi nhân phần trăm của progress ra số giây của progress
                                             // hoặc progress.value
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
            app.render() // mỗi lần next thì render lại, vì đây là app nhỏ nên render ko ảnh hưởng nhiều, nếu app lớn phải dùng cách khác
            app.scrollToActiveSong()
        }
        
        // xử lý bật / tắt Random
        randomBtn.onclick = function(e) {
            app.isRandom = !app.isRandom //true = !true = false
            randomBtn.classList.toggle('active', app.isRandom) // nếu true thì add class active, false thì remove class
        }

        // Xử lý next song khi audio anded, next song hoặc repeat

        audio.onended = function() {
            if(app.isRepeat) { // khi repeat
                audio.play()
            } else { // không repeat thì next song
                nextBtn.click() // dùng lại nextBtn đã tạo ở trên và sử dụng sự kiện click(), nó sẽ tự động click vào nut để sang bài khác
                // hoặc ta có thể chép đoạn code của nextBtn vào cũng đc
            }
        }

            // 2. Xử lý khi bấm repeat
        repeatBtn.onclick = function(e) {
            app.isRepeat = !app.isRepeat //true = !true = false
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        //  Lắng nghe hành vi click vào playlist 
        playlist.onclick = function(e) { // e là event ta nhận đc (ở đây là onclick)
             // target là đich mà ta click vào, ta click vào bất kỳ song nào trong playlist thì nó đều lọt vào đây
            
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) { //closest trả về element cảu nó hoặc cha của nó, nếu ko tìm thấy sẽ trả về null
                
                //xử lý click vào song 
                if (e.target.closest('.song:not(.active)')) {
                    app.currentIndex = Number(songNode.dataset.index) // chuyển sang dạng number bởi songNode.dataset.index là chuỗi
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }

                //xử lý click vào song option
                if (e.target.closest('.option')) {

                }

            } // ở đây ta trò vào thằng song hoặc cha của nó để trường hợp bấm vào 3 chấm(nút option của bài hát) nó ko chuyển bài
        }
    },

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex ++ //tăng thứ tự trong mảng, tức tăng theo bài hát
        if (this.currentIndex >= this.songs.length) { //nếu thứ tự bài lớn hơn độ dài của chuỗi thứ tự bài hát, tức lón hơn thứ tự của bài cuối
            this.currentIndex = 0 // thì quay về bài đầu tiên
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
            newIndex = Math.floor(Math.random() * this.songs.length) //dòng này làm chạy random bài hát với số lượng bài bằng đúng số index
        }
        while (this.arrOldIndexes.includes(newIndex)) // dòng này giúp tránh việc random lại đúng bài hát hiện tại mà ta băt đầu bấm nút random

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong: function() {
        setTimeout(()=>{
            $('.song.active').scrollIntoView({ //.scrollIntoView() là phương thức có sẳn
                behavior: 'smooth',
                block: 'end',
            }); 
        },300)
    },
    

    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties() //this ở đây là app

        // Lắng nghe xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()
    },
}

app.start()