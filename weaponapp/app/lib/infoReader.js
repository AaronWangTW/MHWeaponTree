export function readInfo() {
    const data = require('./weapon_info.json');
    
    var all_nodes = [];
    var all_edges = [];

    for(let i = 0; i < 14; i++) {
        var cnt = 0;
        var id_t = 0;
        var nodes = [];
        var edges = [];
        for(const name in data[i]) {
            nodes.push({
                id:name,
                position: {x:i*300,y:cnt*50},
                data: {label: name},
                type:'weapon'
            })
            for(const up of data[i][name]['upgrades']) {
                edges.push({
                    id:String(id_t),
                    source: name,
                    target: up
                })
                id_t++;
            }
            
            cnt++;
        }
        all_nodes.push(nodes);
        all_edges.push(edges);
    }

    return {
        nodes: all_nodes,
        edges: all_edges
    };
};