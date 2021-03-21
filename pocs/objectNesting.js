const object1 = {
    a: 'somestring',
    b: 42
};
object2 = {
    c: 'string',
}
for (const [key, value] of Object.entries(object1)) {
    object2[key] = value;
}
console.log(object2);