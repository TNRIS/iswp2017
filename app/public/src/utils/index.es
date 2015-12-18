

function slugify(s) {
  return s.replace(/\s+/g, '-');
}

function getMapPadding() {
  if (window.matchMedia("(min-width: 750px)").matches) {
    return [500, 0];
  }
  return [0, 0];
}

export default {
  slugify,
  getMapPadding
};