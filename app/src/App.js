import './App.css';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Dropdown } from 'primereact/dropdown';

import React, { useState, useEffect } from 'react';

import {
  getActiveSlideIndex, 
  getPlaylists, 
  getPresentationDetails, 
  getThumbnail, 
  triggerNextSlide, 
  triggerPrevSlide, 
  triggerSlide 
} from './services/ProPresenterAPIService';

function App() {
  const [isVisibleTopPanel, setIsVisibleTopPanel] = useState(false);
  const [playlists, setPlaylists] = useState(null);
  const [presentations, setPresentations] = useState(null);
  const [activePlaylistUuid, setActivePlaylistUuid] = useState(null);
  const [activePresentationUuid, setActivePresentationUuid] = useState(null);
  const [activeSlide, setActiveSlide] = useState(null);
  const [presentationDetails, setPresentationDetails] = useState(null);

  useEffect(() => {

    getPlaylists().then(playlists => {
      setPlaylists(playlists);

      if (playlists?.length > 0) {
        const firstPlaylist = playlists[0];
        setActivePlaylistUuid(firstPlaylist.uuid);

        if (playlists[0].presentations?.length > 0) {
          setPresentations(playlists[0].presentations);
          onSelectPresentation(playlists[0].presentations[0].uuid);
        }

        return firstPlaylist;
      }
      return null;
    }).then(playlist => {
      if (playlist?.presentations.length > 0) {
        const firstPresentation = playlist.presentations[0];
        setActivePresentationUuid(firstPresentation.uuid);

        return firstPresentation;
      }
      return null;
    }).then(presentation => {
      if (presentation) {
        getPresentationDetails(presentation.uuid).then(presentationDetails => {
          setPresentationDetails(presentationDetails);
        });
      }
    }).then(() => {
      getActiveSlideIndex().then(response => {
        setActiveSlide(response);
      });
    });
  }, []);

  function slideImages() {
    const slides = [];

    for (let i = 0; i < presentationDetails?.slideCount; i++) {
      slides.push(<Image
        src={getThumbnail(presentationDetails.uuid, i)}
        className={presentationDetails.uuid === activeSlide?.presentationUuid && i === activeSlide?.slideIndex ? 'slide active-slide' : 'slide'}
        key={i}
        width='300'
        onClick={() => {
          setActiveSlide(null);
          onTriggerSlide(presentationDetails.uuid, i);
        }} />);
    }

    return slides;
  }

  function selectPlaylist(uuid) {
    if (playlists) {
        const playlist = playlists.find(playlist => playlist.uuid === uuid);
        setPresentations(playlist.presentations);
        
        if (playlist.presentations.length > 0) {
            onSelectPresentation(playlist.presentations[0].uuid);
        }
    }
}

  function onTriggerSlide(uuid, slideIndex) {
    triggerSlide(uuid, slideIndex).then(() => {
      setTimeout(() => {
        getActiveSlideIndex().then(slide => {
          setActiveSlide(slide);
        });
      }, 200);
    });
  }

  function onTriggerNextSlide() {
    triggerNextSlide().then(() => {
      setTimeout(() => {
        getActiveSlideIndex().then(slide => {
          setActiveSlide(slide);
        });
      }, 200);
    });
  }

  function onTriggerPrevSlide() {
    triggerPrevSlide().then(() => {
      setTimeout(() => {
        getActiveSlideIndex().then(slide => {
          setActiveSlide(slide);
        });
      }, 200);
    });
  }

  async function onSelectPresentation(presentationUuid) {
    setActivePresentationUuid(presentationUuid);
    const presentationDetails = await getPresentationDetails(presentationUuid);
    setPresentationDetails(presentationDetails);
  }

  return (
    <div className="App">

      <Sidebar visible={isVisibleTopPanel} position="top" onHide={() => setIsVisibleTopPanel(false)}>
        <div className='playlist-panel'>
          <label>
            Playlist:
            <Dropdown
              value={activePlaylistUuid}
              options={playlists}
              optionValue="uuid"
              optionLabel="name"
              onChange={event => selectPlaylist(event.value)}
            />
          </label>

          <label>
            Presentation:
            <Dropdown
              value={activePresentationUuid}
              options={presentations}
              optionValue="uuid"
              optionLabel="name"
              onChange={event => onSelectPresentation(event.value)}
            />
          </label>
          
        </div>
      </Sidebar>

      <div className='title-panel'>
        <div>
          <h1>{presentationDetails ? presentationDetails.name : 'Presentation'}</h1>
        </div>
        <div>
          <Button
            icon="pi pi-cog"
            tooltip='Settings'
            tooltipOptions={{position: 'bottom'}}
            onClick={() => setIsVisibleTopPanel(true)}
          />
        </div>
      </div>
      <div className='slide-container'>
        {slideImages()}
      </div>
      <div className='footer'>
        <Button
          severity='secondary'
          icon="pi pi-caret-left"
          size='large'
          tooltip='Previous slide'
          tooltipOptions={{position: 'top'}}
          onClick={onTriggerPrevSlide}
        />
        <Button
          severity='secondary'
          icon="pi pi-caret-right"
          size='large'
          tooltip='Next slide'
          tooltipOptions={{position: 'top'}}
          onClick={onTriggerNextSlide}
        />
      </div>
    </div>
  );
}

export default App;
