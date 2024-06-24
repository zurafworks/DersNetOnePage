class Controls {

    // items to append
    _dish = false //görüntünün çerçevesi
    _scenary = false //ilgili div
    _controls = [] //butonlarýn dizisi controls.js de
    _videos = true //DEMO amaçlý itemler

    // contruct the controls
    constructor(dish, scenary) {


        // space of cameras
        this._dish = dish;

        // place to add controls
        this._scenary = scenary;

        // create controllers
        this.controllers(); //butonlar için

        //// run videos (demo)
        //this.videos(100); //yükleme animasyonu için

    }


    //butonlar için (muhtemelen document ready içine alýnabilir ya da oradan manipüle edilmesi gerekebilir)
    controllers() {


        // create add button EKLE
        this.button(false, 'plus', () => {
            this._dish.add();
            if (this._videos) {
                this.videos();
            }

        })

        // create remove button SÝL
        this.button(false, 'trash', () => {
            this._dish.delete();
        })

        this.button(false, 'video', (element) => {

            cameraState = !cameraState;
            if (cameraState) {
                // Kamerayý aç
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        localStream = stream;
                        myVideo.srcObject = stream;
                        myVideo.play();
                    })
                    .catch(error => {
                        console.error('Kamera eriþimi reddedildi:', error);
                    });
            } else {
                // Kamerayý kapat
                localStream.getTracks().find(track => track.kind === 'video').stop();

                myVideo.srcObject = null;
            }
            element.classList.toggle('active');
        }, false)

        this.button(false, 'microphone', (element) => {

            micState = !micState;
            if (micState) {
                // Mikrofonu aç
                navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        localStream = stream;
                        micState = true;
                        // (Sessiz video akýþý nedeniyle myVideo'ya ekleme yapýlmaz)
                    })
                    .catch(error => {
                        console.error('Mikrofon eriþimi reddedildi:', error);
                    });
            } else {
                // Mikrofonu kapat
                //localStream.getTracks().find(track => track.kind === 'audio').stop();
                micState = false;
            }
            element.classList.toggle('active');
        }, false)

        // create video button VÝDEO ÝÇERÝÐÝ OLUÞTUR EKLENÝN ÝÇÝNDE KULLANILIYOR KENDÝ YAYINIMIZI BUNA GÖMECEÐÝZ
        this.button(false, 'tv', (element) => {
            //muhtemelen kamera kapatma açma
            //// add active class
            //element.classList.toggle('active');

            //// set status of videos (totally for demo)
            //this._videos = !this._videos;
            //// generate videos
            //this.videos(0, !this._videos);

        }, true)

        this.button(false, 'expand', () => {
            this._dish.expand();
        })
        this.button(false, 'tachometer-alt', () => {
            this.performance()
        })

        //TASARIM ÝÇÝN KARIÞTIRMA
        this.ratios()

        // github link BU MANÝPÜLE EDÝLÝP SESSÝON ADI GELECEK
        this.link()
    }

    // create a button HERHANGÝ BÝR BUTON OLUÞTURMAK ÝÇÝN
    button(title = false, icon = false, callback, active) {

        // create div element
        let element = document.createElement('div');
        element.className = 'Button';

        // active class (by default creation)
        if (active) {
            element.classList.add('active');
        }

        // create icon with font line awesome
        if (icon) {

            let iconElement = document.createElement('i');
            iconElement.className = 'las la-' + icon;
            element.appendChild(iconElement);

        }

        // create title:
        if (title) {

            element.appendChild(document.createTextNode(title))

        }

        // event of button
        element.addEventListener("click", () => {
            callback(element);
        });

        // return to append later
        this.add(element)
        return element;
    }

    // function to create the link to github
    link() {

        // create link
        let element = document.createElement('a')
        //element.href = 'https://github.com/Alicunde/Videoconference-Dish-CSS-JS'
        element.className = 'Link';
        element.innerHTML = 'Session Adý' //türkçe karakter problemi

        // add icon github
        let icon = document.createElement('i');
        icon.className = 'fa fa-graduation-cap';
        element.appendChild(icon);

        this.add(element)
    }

    // add controller to the array of controllers
    add(element) {
        if (element)
            this._controls.push(element)
        else
            console.log('element not found')
    }

    // render controllers in scenary
    append() {

        // create div of controllers
        let Controls = document.createElement('div');
        Controls.className = 'Controls';

        //// render all buttons at the same time
        //for (let i = 0; i < this._controls.length; i++) { 
        //    Controls.appendChild(this._controls[i]);
        //}
        for (let i = 0; i < this._controls.length; i++) {
            const element = this._controls[i];
            Controls.appendChild(element);
        }

        // append into scenary
        this._scenary.appendChild(Controls);
    }

    //// execute random videos (demo)
    //videos(delay = 0, hide = false) { 
    //    // get number of cameras
    //    let cameras = this._dish.cameras();

    //    // add or delete video per n camera
    //    let i = 0;
    //    while (i < cameras) { 

    //        // timeout to make nice animation
    //        setTimeout((that, camera) => { 

    //            // add or remove video
    //            that._dish.video(camera, (element) => { 

    //                // random current time of video (to make nice demo)
    //                element.currentTime = Math.floor(Math.random() * 30);

    //                // remove class loading (animation by CSS)
    //                setTimeout(() => { 
    //                    element.classList.remove('loading');
    //                }, 100);

    //            }, hide);

    //        }, delay * i, this, i);

    //        i++;
    //    }
    //}

    // execute 10 videos at the same time to check performance
    performance() {

        // number of videos to create
        var videos = 10;

        // interval (demo animation)
        var interval = 100;

        for (var i = 0; i < videos; i++) {
            setTimeout(function (that) {

                // add new camera
                that._dish.add();
                if (that._videos) {
                    that.videos();
                }

            }, i * interval, this)
        }


    }

    // aspect ratio buttons
    ratios() {

        // save the buttons to remove "active" class
        let buttons = [];

        // get ratios from Dish class
        let ratios = this._dish.ratios();

        // create 1 button per ratio
        for (let i = 0; i < ratios.length; i++) {

            let button = this.button(ratios[i], 'ratio', (element) => {

                // remove all actives on ratio
                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].classList.remove('active');
                }
                element.classList.add('active');

                // edit aspect ratio
                this._dish.aspect(i);

            }, i === 0 ? true : false)

            // save in buttons
            buttons.push(button);
        }

    }

    //ZURAFWORKS
    //addVideo(videoElement, userId) {
    //    debugger;

    //    if (videoElements.includes(userId)) {
    //         videoElement = document.querySelector(`[data-userid="${userId}"]`);
    //    } else
    //    {

    //    }
    //    // Video öðesini kontrol kapsayýcýsýna ekleyin
    //    //this._dish.push(videoElement);
    //    this._dish.add();
    //    //this._dish.append(); // Yeni videoyla kontrolleri yeniden oluþturmak için append yöntemini çaðýrýn
    //    // 2. Video elementinin boyutlarýný ayarlayýn
    //    const cameraElement = dish._dish.children[dish._cameras - 1];
    //    const { width, height } = cameraElement.getBoundingClientRect();
    //    videoElement.width = width;
    //    videoElement.height = height;

    //    //videoElement.i

    //    // 3. Video elementini kameraya ekleyin
    //    cameraElement.appendChild(videoElement);

    //    videoElement.setAttribute("data-userid", userId);

    //    // 4. Otomatik oynatmayý etkinleþtirin // bunu silip her video elementini kontrol ederek ayrý ayrý play diyeceðiz
    //    videoElement.autoplay = true;

    //    // 5. Sesi isteðe baðlý olarak kapatýn // bunu silip her video elementini kontrol ederek ayrý ayrý muted kontrol edeceðiz
    //    videoElement.muted = true;

    //    videoElement.stop = true;

    //    // 6. Video elementinin yüklenmesini bekleyin
    //    videoElement.addEventListener("loadedmetadata", () => {
    //        // Video yüklendikten sonra iþlevler...
    //        videoElements.push(userId);
    //    });
    //}
    //addVideo(videoElement, userId) {
    //    // Kullanýcý kimliði kontrolü
    //    if (typeof userId === "undefined" || typeof userId === "null") {
    //        //console.error("Hata: Kullanýcý kimliði (userId) undefined!");
    //        return;
    //    }

    //    // Mevcut video elementini kontrol et
    //    const existingVideoElement = document.querySelector(`[data-userid="${userId}"]`);

    //    if (existingVideoElement) {
    //        // Mevcut video elementinin üzerinde deðiþiklik yap
    //        existingVideoElement.srcObject = videoElement.srcObject; // Video kaynaðýný güncelleyin
    //        existingVideoElement.muted = false; // Sesi açýn
    //        // ...

    //        // Gerekli diðer deðiþiklikleri de burada yapabilirsiniz.
    //    } else {
    //        // Video öðesini kontrol kapsayýcýsýna ekleyin
    //        this._dish.add();

    //        // 2. Video elementinin boyutlarýný ayarlayýn
    //        const cameraElement = dish._dish.children[dish._cameras - 1];
    //        const { width, height } = cameraElement.getBoundingClientRect();
    //        videoElement.width = width;
    //        videoElement.height = height;

    //        // 3. Video elementini kameraya ekleyin
    //        cameraElement.appendChild(videoElement);

    //        videoElement.setAttribute("data-userid", userId);

    //        // 4. Otomatik oynatmayý etkinleþtirin
    //        videoElement.autoplay = true;

    //        // 5. Sesi isteðe baðlý olarak kapatýn
    //        videoElement.muted = true;

    //        videoElement.stop = true;

    //        // 6. Video elementinin yüklenmesini bekleyin
    //        videoElement.addEventListener("loadedmetadata", () => {
    //            // Video yüklendikten sonra iþlevler...
    //            videoElements.push(userId);
    //        });
    //    }
    //}

    addVideo(videoElement, userId) {
        debugger;
        //Kullanýcý kimliði kontrolü
        if (!userId) {
            //console.error("Hata: Kullanýcý kimliði (userId) undefined!");
            return;
        }

        //Mevcut video elementini kontrol et
        const existingVideoElement = document.querySelector(`[data-userid="${userId}"]`);

        if (existingVideoElement) {
            // Mevcut video elementinin üzerinde deðiþiklik yap
            existingVideoElement.srcObject = videoElement.srcObject; // Video kaynaðýný güncelleyin
            existingVideoElement.muted = false; // Sesi açýn
            // ...

            // Gerekli diðer deðiþiklikleri de burada yapabilirsiniz.
        } else {
            // Video öðesini kontrol kapsayýcýsýna ekleyin
            this._dish.add();

            // 2. Video elementinin boyutlarýný ayarlayýn
            const cameraElement = dish._dish.children[dish._cameras - 1];
            const { width, height } = cameraElement.getBoundingClientRect();
            videoElement.width = width;
            videoElement.height = height;

            // 3. Video elementini kameraya ekleyin
            cameraElement.appendChild(videoElement);

            videoElement.setAttribute("data-userid", userId);

            // 4. Otomatik oynatmayý etkinleþtirin
            videoElement.autoplay = true;

            // 5. Sesi isteðe baðlý olarak kapatýn
            videoElement.muted = true;

            videoElement.stop = true;

            // 6. Video elementinin yüklenmesini bekleyin
            videoElement.addEventListener("loadedmetadata", () => {
                // Video yüklendikten sonra iþlevler...
                videoElements.push(userId);
            });
        }
    }
}

