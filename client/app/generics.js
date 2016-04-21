var dragSource;

function dragLeave(div, event) {
    div.style.opacity = 1;
}
function dragOver(div, event) {
    div.style.opacity = 0.3;
    event.preventDefault();
}
function dragStart(div, event) {
    dragSource = div;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', div.innerHTML);
}
function dragDrop(div, event) {
    div.style.opacity = 1;
    if (event.stopPropogation) {
        event.stopPropogation();
    }

    if (dragSource != div) {
        var oldId = dragSource.id;
        dragSource.innerHTML = div.innerHTML;
        dragSource.id = div.id;
        div.id = oldId;
        div.innerHTML = event.dataTransfer.getData('text/html');
    }

    return false;
}
