export const GroupPopulater = [
    {
        path: 'users.memberID',
        select: 'userName',
    },
    {
        path: 'request.memberID',
        select: ['userName', 'bio']
    },
    {
        path: 'items.addedBy',
        select: ['userName', 'bio']
    },
    {
        path: 'items.broughtBy',
        select: ['userName', 'bio']
    }
]