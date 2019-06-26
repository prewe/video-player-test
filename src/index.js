import $ from 'jquery';
import './style.scss';
import { builtinModules } from 'module';



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
    console.log(this._videolist);
    setTimeout(() => {
      this._videolist.then(res => res.forEach(vid => this._wrapper.append(this.createVideoContainer(vid.src))));
    }, 3000)
  }

  addFullVid(src) {
    this._wrapper.append(`<div class="fullvid">                          
                            <video class="full-video" src="${src}"></video>
                          </div>`);
    $('.fullvid').append(this.addCloseVid())
                  .append(this.addControls());
    $('.full-video').on('timeupdate', (e) => {
      let progressBarPos = `${e.target.currentTime / e.target.duration * 100}%`;
      console.log(progressBarPos);
      $('.progressbar').css('width', progressBarPos);
    });
  }

  addCloseVid() {
    return $(`<div class="closevid"></div>`).on('click', () => $('.fullvid').remove());
  }

  addControls() {
    return $(`<div class="controls"></div>`).append(this.addProgressBar())
                                            .append(this.addPlayPause());
  }

  addProgressBar() {
    return $(`<div class="progressbar"></div>`);
  }

  addPlayPause() {
    return $(`<button id="play-pause"></button>`).on('click', () => this.togglePlayPause());
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

  
}


  const model = new Model;
  const view = new View(model);
  model.addVideoList();
  view.addVideo();












