import React, { Component } from 'react';
import Play from 'react-icons/lib/md/play-arrow';
import Heart from 'react-icons/lib/md/favorite';

// largeArtworkUrl :: String -> String
// Given an artwork URL produces a new URL for fetching the large variant of
// the artwork from. If no artwork URL is given, produces the empty string.
const largeArtworkUrl = (artworkUrl) => {
  if (!artworkUrl) return '';
  const suffixLength = 9; // suffix is 'large.jpg'
  const base = artworkUrl.slice(0, -suffixLength);
  return base + 't300x300.jpg';
}

// numberAbbreviation :: Number -> String
// Given a number, produces a string abbreviation for the number.
const numberAbbreviation = (number) => {
  if (number < 1000)
    return number;
  else if (number < 1000000)
    return (number / 1000).toPrecision(3) + 'K';
  else if (number < 1000000000)
    return (number / 1000000).toPrecision(3) + 'M';
  else
    return (number / 1000000000).toPrecision(3) + 'B';
}

// splitTagList :: String -> [String]
// Splits a space-delimited list of tags, and produces an array of tags.
const splitTagList = (tagList) => {
  let list = [];
  let token = '';
  outer:
  for (let i = 0; i < tagList.length; i++) {
    const ch = tagList[i];

    // tag delimiter
    if (ch === ` `) {
      if (!token.length) continue;
      list.push(token);
      token = '';
    }

    // start of multiword tag
    else if (ch === `"`) {
      for (let j = i + 1; j < tagList.length; j++) {
        const ch_ = tagList[j];
        if (ch_ === `"`) {
          list.push(token);
          token = '';
          i = j;
          continue outer;
        }
        token += ch_;
      }
    }

    else {
      token += ch;
    }
  }

  if (token.length)
    list.push(token);

  return list;
}

class ResultItem extends Component {
  shouldComponentUpdate(nextProps) {
    const { activeTrackId: nextActiveTrackId } = nextProps;
    const { id, activeTrackId } = this.props;

    // Don't update if the currently active track has not changed
    if (nextActiveTrackId === activeTrackId) return false;

    // Update if our activeTrack status has changed.
    return (id === activeTrackId || id === nextActiveTrackId);
  }

  render() {
    const { id, title, artwork_url, activeTrackId, handlePlay, user,
      playback_count, likes_count, tag_list } = this.props;

    console.log(`rerednering item ${id}`);

    const isActive = (id === activeTrackId);
    const tagList = splitTagList(tag_list);
    const numTagsToShow = 5;
    tagList.length = numTagsToShow;

    const style = {
      display: 'flex',
      flexShrink: 0,
      padding: '10px 16px',
      borderBottom: '1px solid rgba(100,100,100,.1)',
      alignItems: 'center',
    };

    return isActive ? (
      <div style={{ background: '#0097FF', padding: '1em', color: '#fff' }}>
        <div style={{ display: 'flex' }}>
          <img style={{ borderRadius: 75 }}
            width="150" height="150" src={largeArtworkUrl(artwork_url)} />
          <div style={{ marginLeft: '2em', display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
            <h3 style={{ margin: 0, textShadow: '0 1px 1px rgba(0,0,0,.1)'}}>{title}</h3>
            <h4 style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>{user.username}</h4>
            <div style={{ marginTop: '1em', color: '#005592', fontSize: 14, fontWeight: 'bold' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: -5 }}>
                <Play width={22} height={22} /> {numberAbbreviation(playback_count)}
                 <Heart width={18} height={18} style={{ margin: '0 3px 0 16px' }} /> {numberAbbreviation(likes_count)}
              </div>

              <div style={{ marginTop: 5 }}>
                {tagList.map(tag =>
                  <span key={tag} style={{
                    marginRight: 8, display: 'inline-block', padding: '3px 9px', backgroundColor: '#005592', color: '#1EA1FF', borderRadius: 20, fontSize: 13
                  }}>
                    #{tag}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/*
        <img src={dataUrl} style={{ marginTop: '1em' }} />
        */}
      </div>
    ) : (
      <div style={{...style }} onClick={() => handlePlay(id)}>
        <img style={{ width: 40, height: 40, borderRadius: 20 }}
           src={largeArtworkUrl(artwork_url)} />
         <span style={{ fontSize: 14, margin: '0 1em' }}>{title}</span>
      </div>
    )
  }
}

export default ResultItem;
