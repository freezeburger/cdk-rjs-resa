import * as Types from '@/core';

type Callback = (data:any) => void;


const fetchPosts = async () => {
    const response = await fetch('https://dummyjson.com/posts'); 
    const data = await response.json();
    return data.posts;
}


export const store = {

    state:{
        products: [] as Types.Products.Product[],
        posts: [] as Types.Posts.Post[],
    },

    get(){ return this.state },

    act( action:string){
        console.log('action', action);
        
        if(action === 'LOAD_POSTS'){
            fetchPosts()
            .then((posts:Types.Posts.Post[]) => {
                this.state = {...this.state, posts} ;
                this.notify();
            })
        }
    },

    listeners : new Set<Callback>(),

    subscribe(cb: Callback){
        this.listeners.add(cb);
        cb(this.get());
        return () => { this.listeners.delete(cb); };
    },

    notify(){
        this.listeners.forEach((cb) => cb(this.get()));
    }
}