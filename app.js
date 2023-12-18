const url = "https://jsonplaceholder.typicode.com";
async function fetchData (endpoint) {
    try {
        const response = await fetch(`${url}/${endpoint}`);
        return response.json();
    }
    catch (err) {
        console.log(err);
        return []
    }
}

async function fetchOneComment (id) {
    try {
        const response = await fetch(`${url}/comments/${id}`);
        return response.json();
    }
    catch (err) {
        console.log(err);
        return {}
    }
}


async function print() {
    const [users, posts, comments] = await Promise.all(
        [
            fetchData('users'),
            fetchData('posts'),
            fetchData('comments'),
        ]
    )
    
    const enhancedUsers = users.map(user => {
        const userPosts = posts.filter(post => post.userId === user.id);
        const userComments = comments.filter((comment) => comment.email === user.email);
        return {
            ...user,
            posts: userPosts,
            comments: userComments,
        };
    });
    console.log("3.Users: ", enhancedUsers);

    const usersWithMoreThan3Comments = enhancedUsers.filter((user) => {
        return user.comments.length > 3;
    });
    

    console.log("4.Users with more than 3 comments: ", usersWithMoreThan3Comments);

    const reformatUser = users.map((user) => {
        const userPosts = posts.filter((post) => post.userId === user.id);
        const userComments = comments.filter((comment) => comment.email === user.email);
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            postsCount: userPosts.length,
            commentsCount: userComments.length,
        };
    });
    console.log("5.Reformat users: ", reformatUser);

    const { maxPosts, maxUserWithPost } = reformatUser.reduce((acc, user) => {
        if (user.postsCount > acc.maxPosts) {
            acc.maxPosts = user.postsCount;
            acc.maxUserWithPost = user;
        }
        return acc;
    }, { maxPosts: 0, maxUserWithPost: null });

    const { maxComments, maxUserWithComment } = reformatUser.reduce((acc, user) => {
        if (user.commentsCount > acc.maxComments) {
            acc.maxComments = user.commentsCount;
            acc.maxUserWithComment = user;
        }
        return acc;
    }, { maxComments: 0, maxUserWithComment: null });
    
    console.log("6.1. User with the most posts:", maxUserWithPost);
    console.log("6.2. User with the most comments:", maxUserWithComment);

    const sortUser = [...reformatUser].sort(function (a, b) {
        b.postsCount - a.postsCount
    })

    console.log("7.Sort user by postsCount", sortUser);

    const post = await fetchOneComment(1)
    post.comments = comments.filter(comment => comment.postId === post.id)

    console.log("8. Reformat Posts", post);

}

print();
