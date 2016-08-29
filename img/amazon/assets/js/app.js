var NS = window.NS || {};
function AppViewModel() {
    var self = this;

    self.breadcrumb = ko.observableArray();
    self.currentActiveNode = ko.observable();
    self.spinnerLoader = function (page, element) {
        var loader = {};
        var txt = $('<img src="ajax-loader.gif"/>');
        loader.load = function () {
            $(element).empty();
            $(element).append(txt);
        };
        loader.unload = function () {
            txt.remove();
        };
        return loader;
    };
};

$(function () {
    var viewModel = new AppViewModel();
    var $tree = $("#tree");

    NS.viewModel = viewModel;
    NS.$tree = $tree;

    pager.Href.hash = '#!/';
    pager.extendWithPage(viewModel);
    ko.applyBindings(viewModel);
    pager.start();

    $tree.dynatree({
        onActivate: function (node) {
            viewModel.currentActiveNode(node);

            viewModel.breadcrumb([]);
            node.visitParents(function (nod) {
                nod.data.title && viewModel.breadcrumb.unshift(nod.data.title);
            });
            viewModel.breadcrumb.push(node.data.title);

            if (node.data.hash) {
                document.location.hash = "#!/" + node.data.hash;
            } else {
                document.location.hash = "#";
            }
        },
        persist: true,
        clickFolderMode: 3
    });
});