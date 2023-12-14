const url = "https://jsonplaceholder.typicode.com";
async function fetchData (endpoint) {
    try {
        const response = await fetch(`${url}/${endpoint}`);
        return response.json();
    }
    catch (err) {
        console.log(err);
    }
}


async function print() {
    const [users, posts, comments, postWithId1] = await Promise.all(
        [
            fetchData('users'),
            fetchData('posts'),
            fetchData('comments'),
            fetchData('posts/1'),
        ]
    )
    
    const enhancedUsers = users.map(user => {
        const userPosts = posts.filter(post => post.userId === user.id);
        const userComments = comments.filter(comment => userPosts.some(post => post.id === comment.postId));
        return {
            ...user,
            posts: userPosts,
            comments: userComments,
        };
    });
    console.log("3.Users: ", enhancedUsers);

    let usersWithMoreThan3Comments = users.filter((user) => {
        let userComments = comments.filter((comment) => comment.email === user.email);
        return userComments.length > 3;
    });
    

    console.log("4.Users with more than 3 comments: ", usersWithMoreThan3Comments);

    let reformatUser = users.map((user) => {
        let userPosts = posts.filter((post) => post.userId === user.id);
        let userComments = comments.filter((comment) => userPosts.some((post) => post.id === comment.postId));
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

    const { maxPosts, maxComments, maxUserWithPost, maxUserWithComment } = reformatUser.reduce((acc, user) => {
        if (user.postsCount > acc.maxPosts) {
            acc.maxPosts = user.postsCount;
            acc.maxUserWithPost = user;
        }
    
        if (user.commentsCount > acc.maxComments) {
            acc.maxComments = user.commentsCount;
            acc.maxUserWithComment = user;
        }
    
        return acc;
    }, { maxPosts: 0, maxComments: 0, maxUserWithPost: null, maxUserWithComment: null });
    
    console.log("6.User with the most posts:", maxUserWithPost);
    console.log("User with the most comments:", maxUserWithComment);

    let sortUser = reformatUser.sort(function (a, b) {
        b.postsCount - a.postsCount
    })

    console.log("7.Sort user by postsCount", sortUser);

    postWithId1.comments = comments.filter(comment => comment.postId === postWithId1.id)

    console.log("8. Reformat Posts", postWithId1);

}

print();
