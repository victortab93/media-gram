import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
import { router } from 'expo-router';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId: '6650cce00020b432c282',
    databaseId: '6653c93c0032b7b34b67',
    userCollectionId:'6653c9e1002bdc310b79',
    videoCollectionId: '6653ca6b000b0233ae9c',
    storageId: '6653ccba0001eb153e06'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId)
    .setPlatform(config.platform)
;


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storages = new Storage(client);

export const createUser = async (email, password, username) => {
    try{
        const newAccount = await account.create(ID.unique(), email,password, username);
        

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);
        
        const user = await databases.createDocument(config.databaseId
            , config.userCollectionId
            , ID.unique(), {
                accountId: newAccount.$id,
                username: username,
                email: email,
                avatar: avatarUrl
            }
        );

        const session = await SignInApp(email,password);
        
        return user;
    }catch(e) {
        console.log(e);
        throw new Error(e);
    }  
}

export async function SignInApp(email, password){
    try {
        const session = await account.createEmailPasswordSession(email, password);

        
        return session;
    } catch(e) {
        throw new Error(e);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        );

        if(!currentUser) throw Error
        return currentUser.documents[0];

    } catch(e) {
        throw Error(e);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(config.databaseId
            , config.videoCollectionId
            ,
        );

        return posts.documents;
    } catch(e) {
        throw new Error(e);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(config.databaseId
            , config.videoCollectionId
            , [Query.orderDesc('$createdAt'), Query.limit(7)]
        );
        return posts.documents;
    } catch(e) {
        throw new Error(e);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(config.databaseId
            , config.videoCollectionId
            , [Query.search('title', query)]
        );
        return posts.documents;
    } catch(e) {
        throw new Error(e);
    }
}

export const getUserPosts = async (userId) => {
    try {
        
        const posts = await databases.listDocuments(config.databaseId
            , config.videoCollectionId
            , [Query.equal('creator', [userId]), Query.orderDesc('$createdAt')]
        );
        return posts.documents;
    } catch(e) {
        throw new Error(e);
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');

        return session;
    } catch(e) {
        throw new Error(e)
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {
        if(type === 'video') {
            fileUrl = storages.getFileView(config.storageId, fileId)
        } else if(type ==='image'){
            fileUrl = storages.getFilePreview(config.storageId, fileId
                , 2000, 2000, 'top', 100
            )
        } else{
            throw new Error('Invalid File Type')
        }
        
        if(!fileUrl) throw Error;
        return fileUrl
    } catch(e) {
        throw new Error(e)
    }

}

export const uploadFile = async (file, type) => {
    if(!file) {return;}
    /*
    const {mimeType, ...rest} = file;
    const asset = {type: mimeType, ...rest};
*/
    const asset ={
        name : file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    }
    
    try {
        const uploadedFile = await storages
        .createFile(
            config.storageId,
            ID.unique(),
            asset
        )
        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch(e) {
        throw new Error(e)
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])
        const newPost = await databases.createDocument(config.databaseId
            ,config.videoCollectionId
            ,ID.unique()
            ,{
                title : form.title,
                thumbnail : thumbnailUrl,
                video : videoUrl,
                prompt : form.prompt,
                creator : form.userId
            }
        )

        return newPost;
    } catch(e) {
        throw new Error(e)
    }
}







