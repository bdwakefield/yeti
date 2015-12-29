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
function deleteBlock(div) {
    var viewContent = '';
    _.forEach(document.getElementById('viewEditor').childNodes, function(block) {
        if (block.id !== div) {
            viewContent += '{{-' + block.id + '}}\n';
        }
    });
    angular.element($('#viewEditor')).scope().deleteBlock(viewContent);
}
function editBlock(blockId) {
    angular.element($('#viewEditor')).scope().editBlock(blockId);
}

//$(document).on('keydown', function(e) {
//    if (e.metaKey && e.which === 83) {
//        e.preventDefault();
//        angular.element($('#mainBody')).scope().saveKeyPressed();
//        return false;
//    }
//});