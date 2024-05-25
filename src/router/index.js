
import lorem from "@/pages/lorem.html";
import flexGap from "@/pages/flex-gap.html";
import dragDrop from "@/pages/drag-drop.html";

const routes = [

    {
        path: "/",
        name:'Home',
        component: '<h1> home !</h1>'
    },
    {
        path: "/posts",
        name:'   Posts',
        component: '<h1> all post !</h1> <p> <router-link path="/posts/1"> Post 1 </router-link>  <br> <router-link path="/posts/2"> Post 2 </router-link> </p>'
    },
    {
        path: "/posts/:id",
        name:'post',
        component: '<h1> current post </h1>'
    },
    {
        title: 'flex gap',
        component : flexGap,
        name :'flexGap',
        path: "/flex-gap"
    },
    {
        title: 'useDragDrop',
        component : dragDrop,
        name :'dragDrop',
        path: "/drag-drop"
    },
    {
        title: 'lorem title',
        component : lorem,
        name :'lorem',
        path: "/lorem"
    }
];

export default  routes