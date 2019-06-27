import $ from 'jquery';
import './style.scss';




class Model {
  constructor() {
    this._videolist = this.addVideoList();
  }

  addVideoList() {
    return fetch('./videolist.json').then(response => response.json())
      .catch(err => console.log(err));
  }

}

class View {
  constructor(model) {
    this._model = model;
    this._wrapper = $('.app');
    this._videolist = this._model._videolist; 
  }

  createVideoContainer(src) {
    return $(`<div class="video__container">             
                <video class="video" src="${src}"></video> 
              </div>`).on('click', () => this.addFullVid(src));
  }

  addVideo() {
    this._videolist.then(res => res.forEach(vid => this._wrapper.append(this.createVideoContainer(vid.src))));

    setTimeout(() => {
      $('.preloader').addClass('hide');
    }, 2000);
  }

  addFullVid(src) {
    this._wrapper.append(`<div class="fullvid"><video class="full-video" src="${src}"></video></div>`)               
    $('.fullvid').append(this.addCloseVid())
                  .append(this.addControls());
    $('.full-video').on('timeupdate', (e) => {
      let progressBarPos = `${e.target.currentTime / e.target.duration * 100}%`;
      $('.progress').css('width', progressBarPos);
    });
  }

  addCloseVid() {
    return $(`<div class="closevid"></div>`).on('click', () => $('.fullvid').remove());
  }

  addControls() {
    return $(`<div class="controls"></div>`).append(this.addProgressBar())
                                            .append(this.addPlayPause())
                                            .append(this.addVolumeControl());
  }

  addProgressBar() {
    return $(`<div class="progressbar"><div class="progress"></div></div>`).on('click', (e) => this.changeProgress(e));                                                                   
  }

  addPlayPause() {
    return $(`<div id="play-pause"></div>`).on('click', () => this.togglePlayPause());
  }

  addVolumeControl() {
    return $(`<input type="range" name="volume" class="volumectrl" min="0" max="1" step="0.05">`).on('change', () => this.volumeChange());
  }

  volumeChange() {
    const volume = $('.volumectrl').val();
    $('.full-video').get(0).volume = volume;
  }

  togglePlayPause() {
    const video = document.querySelector('.full-video');
    const btn = document.querySelector('#play-pause');
    if (video.paused) {
      video.play();
      btn.className = "play";
    } else {
      video.pause();
      btn.className = "pause";
    }
  }

  changeProgress(e) {
    const progressTime = (e.offsetX / $('.progressbar').get(0).offsetWidth) * $('.full-video').get(0).duration;
    $('.full-video').get(0).currentTime = progressTime;
  }

  addPreloader() {
    this._wrapper.append(`<div class="preloader">
                            <div class="bar-wrap">
                              <div class="bar"></div>
                              <div class="bar reverse"></div>
                              <div class="bar"></div>
                            </div>
                          </div>`);
  }

}


const model = new Model;
const view = new View(model);
model.addVideoList();
view.addPreloader();
view.addVideo();












